import { Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task) // Inject the TypeORM repository
    private taskRepository: Repository<Task>,
  ) {}

  async getAllTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.taskRepository.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status: 'OPEN' });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    const tasks = await query.getMany();

    return tasks;
  }

  async addTask(createTaskDto: CreateTaskDto, user: User) {
    const { title, description } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.taskRepository.save(task);
    return task;
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOneBy({ id: id });
    if (!found) {
      throw new NotFoundException(`Task with ${id} not found`);
    }

    return found;
  }

  async updateTask(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`This task with ${id} is not found`);
    }
  }
}
