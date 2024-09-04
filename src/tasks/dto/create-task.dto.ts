import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Title',
    example: 'Sample title',
  })
  title: string;

  @ApiProperty({
    description: 'description',
    example: 'Description',
  })
  description: string;
}
