import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Title',
    example: 'Sample title',
  })
  title: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'description',
    example: 'Description',
  })
  description: string;
}
