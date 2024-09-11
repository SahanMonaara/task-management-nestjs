import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './tasks.repository';
import { DataSource } from 'typeorm';
import { Task } from './tasks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: TaskRepository,
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(Task).extend(TaskRepository);
      },
      inject: [DataSource],
    },
  ],
})
export class TasksModule {}
