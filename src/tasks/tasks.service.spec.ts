import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './tasks.repository';
import { TaskStatus } from './tasks-status.enum';

const mockTaskRepository = () => ({
  getAllTasks: jest.fn(),
  getTaskById: jest.fn(),
});

const mockUser = {
  username: 'Sahan',
  id: '123',
  password: 'qweasd123',
  tasks: [],
};

describe('TaskService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();
    tasksService = module.get(TasksService);
    tasksRepository = module.get(TaskRepository);
  });

  describe('getAllTasks', () => {
    it('Call TasksRepository.getTasks and returns the results', async () => {
      tasksRepository.getAllTasks.mockResolvedValue('someTask');
      const result = await tasksService.getAllTasks(null, mockUser);
      expect(result).toEqual('someTask');
    });
  });

  describe('getTaskById', () => {
    it('Call TasksRepository.getTaskById and returns the result', async () => {
      const mockTask = {
        title: 'Test title',
        description: 'Test desc',
        id: 'someId',
        status: TaskStatus.OPEN,
      };

      tasksRepository.getTaskById.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });
  });
});
