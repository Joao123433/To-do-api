import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { PaginationDto } from "src/commom/dto/pagination.dto";
import { CreateTaskDto } from "./dto/create.dto";
import { UpdateTaskDto } from "./dto/update.dto";

@Controller("tasks")
export class TasksController {
	constructor(private readonly taskService: TasksService) {}

	@Get()
	findAll(@Query() pagination: PaginationDto) {
		return this.taskService.findAll(pagination);
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.taskService.findOne(id);
	}

	@Post()
	create(@Body() body: CreateTaskDto) {
		return this.taskService.createOne(body);
	}

	@Patch(":id")
	update(@Param("id") id: string, @Body() body: UpdateTaskDto) {
		return this.taskService.updateOne(id, body);
	}
}
