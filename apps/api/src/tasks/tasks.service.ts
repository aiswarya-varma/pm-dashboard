import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getTasksByProject(projectId: string) {
    return this.prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: { name: true, email: true }
        },
        assignee: {
          select: { name: true } // avatarUrl: true
        },
      },
    });
  }

  async createTask(
    projectId: string,
    data: CreateTaskDto,
    user: any
  ) {
    return this.prisma.task.create({
      data: {
        title: data.title,
        status: data.status as any,
        projectId,
        createdById: user.userId,
      },
    });
  }

  async updateTask(
    taskId: string,
    data: Partial<UpdateTaskDto>,
  ) {
    return this.prisma.task.update({
      where: { id: taskId },
      data,
    });
  }
}