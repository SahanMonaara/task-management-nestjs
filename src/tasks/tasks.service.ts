import { Injectable } from '@nestjs/common';
import { TaskRepository } from './tasks.repository';
import { Task } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  //This is for the get all tasks
  async getAllTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getAllTasks(filterDto, user);
  }
  // Get task by id
  async getTaskById(id: string): Promise<Task> {
    return this.taskRepository.getTaskById(id);
  }

  // //This is for the create tasks
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.addTask(createTaskDto, user);
  }

  // //This is for the updating tasks
  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.taskRepository.updateTask(id, status);
  }
  //This is for the delete tasks
  async deleteTaskById(id: string): Promise<void> {
    return this.taskRepository.deleteTask(id);
  }
}
