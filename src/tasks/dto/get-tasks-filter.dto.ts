import { TaskStatus } from '../tasks.model';
import { ApiProperty } from '@nestjs/swagger';

export class GetTasksFilterDto {
  @ApiProperty({
    description: 'TaskStatus',
    example: 'Done',
  })
  status?: TaskStatus;

  @ApiProperty({
    description: 'Search string',
    example: 'Title',
  })
  search?: string;
}
