import { IsString } from "class-validator";
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  title!: string;

  @IsString()
  status!: TaskStatus;
}