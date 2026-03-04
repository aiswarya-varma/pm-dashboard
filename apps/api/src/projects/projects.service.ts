import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async getProjects(user: any) {
    const projects = await this.prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });

    return {
      username: user.email,
      projects,
    };
  }

  async getProjectById(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }

  async createProject(name: string, user: any) {
    if (user.role === "READONLY") {
      throw new ForbiddenException(
        "Read-only users cannot create projects"
      );
    }

    return this.prisma.project.create({
      data: {
        name,
        createdById: user.userId,
      },
    });
  }
}