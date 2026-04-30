import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Req,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";

@Controller("projects")
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService
  ) {}

  @Get()
  async getProjects(@Req() req: any) {
    return this.projectsService.getProjects(req.user);
  }

  @Get(":id")
  async getProjectById(@Param("id") id: string) {
    return this.projectsService.getProjectById(id);
  }

  @Post()
  async createProject(
    @Body() body: CreateProjectDto,
    @Req() req: any
  ) {
    return this.projectsService.createProject(
      body.name,
      body.description,
      req.user
    );
  }

  @Delete(":id")
  async deleteProject(@Param("id") id: string) {
    return this.projectsService.deleteProject(id);
  }
}