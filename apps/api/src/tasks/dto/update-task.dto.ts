import { IsOptional, IsString } from "class-validator";
import { TaskStatus } from '@prisma/client';

export class UpdateTaskDto {
  @IsString()
  title!: string;

  @IsString()
  status!: TaskStatus;

  @IsOptional()
  @IsString()
  assigneeId?: string;
}