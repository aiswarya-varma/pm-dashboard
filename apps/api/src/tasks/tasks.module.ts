import { Module } from "@nestjs/common";
import { TasksController } from "./tasks.contoller";
import { TasksService } from "./tasks.service";

@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}