import { Repository } from 'typeorm';
import { Task } from './tasks.entity';

export class TaskRepository extends Repository<Task> {}
