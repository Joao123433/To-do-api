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
import { ApiBearerAuth, ApiParam, ApiQuery } from "@nestjs/swagger";

@Controller("tasks")
@ApiBearerAuth()
@UseInterceptors(LoggerInterceptor)
export class TasksController {
	constructor(private readonly taskService: TasksService) {}

	@Get()
	@ApiQuery({
		name: "limit",
		required: false,
		example: 10,
		description: "Number of items to return",
	})
	@ApiQuery({
		name: "offset",
		required: false,
		example: 0,
		description: "Number of items to skip",
	})
	findAll(@Query() pagination: PaginationDto, @TokenPayload() tokenPayload: PayloadDto) {
		return this.taskService.findAll(pagination, tokenPayload);
	}

	@Get(":id")
	@ApiParam({
		name: "id",
		required: true,
		description: "Task ID",
	})
	findOne(@Param("id") id: string) {
		return this.taskService.findOne(id);
	}

	@Post()
	create(@Body() body: CreateTaskDto, @TokenPayload() tokenPayload: PayloadDto) {
		return this.taskService.createOne(body, tokenPayload);
	}

	@Patch(":id")
	@ApiParam({
		name: "id",
		required: true,
		description: "Task ID",
	})
	update(
		@Param("id") id: string,
		@Body() body: UpdateTaskDto,
		@TokenPayload() tokenPayload: PayloadDto,
	) {
		return this.taskService.updateOne(id, body, tokenPayload);
	}

	@Delete(":id")
	@ApiParam({
		name: "id",
		required: true,
		description: "Task ID",
	})
	delete(@Param("id") id: string, @TokenPayload() tokenPayload: PayloadDto) {
		return this.taskService.deleteOne(id, tokenPayload);
	}
}
