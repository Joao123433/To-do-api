import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseInterceptors,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { PaginationDto } from "src/commom/dto/pagination.dto";
import { CreateTaskDto } from "./dto/create.dto";
import { UpdateTaskDto } from "./dto/update.dto";
import { TokenPayload } from "src/auth/params/token-payload.param";
import { PayloadDto } from "src/auth/dto/payload.dto";
import { LoggerInterceptor } from "src/commom/interceptors/logger.interceptor";

@Controller("tasks")
@UseInterceptors(LoggerInterceptor)
export class TasksController {
	constructor(private readonly taskService: TasksService) {}

	@Get()
	findAll(@Query() pagination: PaginationDto, @TokenPayload() tokenPayload: PayloadDto) {
		return this.taskService.findAll(pagination, tokenPayload);
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.taskService.findOne(id);
	}

	@Post()
	create(@Body() body: CreateTaskDto, @TokenPayload() tokenPayload: PayloadDto) {
		return this.taskService.createOne(body, tokenPayload);
	}

	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() body: UpdateTaskDto,
		@TokenPayload() tokenPayload: PayloadDto,
	) {
		return this.taskService.updateOne(id, body, tokenPayload);
	}

	@Delete(":id")
	delete(@Param("id") id: string, @TokenPayload() tokenPayload: PayloadDto) {
		return this.taskService.deleteOne(id, tokenPayload);
	}
}
