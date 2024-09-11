import { Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

export class TaskRepository extends Repository<Task> {
  async getAllTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    console.log(filterDto);
    const query = this.createQueryBuilder('task');
    const tasks = await query.getMany();

    return tasks;
  }

  async addTask(createTaskDto: CreateTaskDto) {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);
    return task;
  }
}
