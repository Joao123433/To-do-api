import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PaginationDto } from "src/commom/dto/pagination.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTaskDto } from "./dto/create.dto";
import { UpdateTaskDto } from "./dto/update.dto";
import { PayloadDto } from "src/auth/dto/payload.dto";
import { ResponseDeleteTasktDto, ResponseTaksDto } from "./dto/response.dto";

@Injectable()
export class TasksService {
	constructor(private prismaService: PrismaService) {}

	async findAll(pagination: PaginationDto, tokenPayload: PayloadDto): Promise<ResponseTaksDto[]> {
		try {
			const { limit, offset = 0 } = pagination;

			const tasks = await this.prismaService.tasks.findMany({
				select: {
					id: true,
					title: true,
					deadline: true,
					comment: true,
					Status: {
						select: {
							id: true,
							name: true,
						},
					},
					Priorities: {
						select: {
							id: true,
							name: true,
						},
					},
					User: {
						select: {
							id: true,
							email: true,
						},
					},
					createdAt: true,
					updatedAt: true,
				},
				where: {
					usersId: tokenPayload.sub,
				},
				orderBy: {
					createdAt: "asc",
				},
				take: limit,
				skip: offset,
			});

			return tasks;
		} catch (error) {
			throw new HttpException("Error fetching tasks", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async findOne(id: string): Promise<ResponseTaksDto> {
		try {
			const task = await this.prismaService.tasks.findFirst({
				where: {
					id: id,
				},
				select: {
					id: true,
					title: true,
					deadline: true,
					comment: true,
					Status: {
						select: {
							id: true,
							name: true,
						},
					},
					Priorities: {
						select: {
							id: true,
							name: true,
						},
					},
					User: {
						select: {
							id: true,
							email: true,
						},
					},
					createdAt: true,
					updatedAt: true,
				},
			});

			if (!task) throw new HttpException("Task not found", HttpStatus.NOT_FOUND);

			return task;
		} catch (error) {
			throw new HttpException(
				error.messagem ? error.messaage : "Error fetching tasks",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async createOne(data: CreateTaskDto, tokenPayload: PayloadDto): Promise<ResponseTaksDto> {
		try {
			const task = await this.prismaService.tasks.create({
				data: {
					title: data.title,
					deadline: new Date(data.deadline),
					comment: data.comment,
					statusId: data.status,
					prioritiesId: data.priority,
					usersId: tokenPayload.sub,
				},
				select: {
					id: true,
					title: true,
					deadline: true,
					comment: true,
					Status: {
						select: {
							id: true,
							name: true,
						},
					},
					Priorities: {
						select: {
							id: true,
							name: true,
						},
					},
					User: {
						select: {
							id: true,
							email: true,
						},
					},
					createdAt: true,
					updatedAt: true,
				},
			});

			return task;
		} catch (error) {
			throw new HttpException(
				error.message ? error.message : "Error creating task",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async updateOne(
		id: string,
		data: UpdateTaskDto,
		tokenPayload: PayloadDto,
	): Promise<ResponseTaksDto> {
		try {
			const findTask = await this.prismaService.tasks.findFirst({
				where: {
					id: id,
				},
			});

			if (!findTask) throw new HttpException("Task not found", HttpStatus.NOT_FOUND);

			if (findTask.usersId !== tokenPayload.sub)
				throw new HttpException("Access denied", HttpStatus.FORBIDDEN);

			const updatedTask = await this.prismaService.tasks.update({
				where: {
					id: findTask.id,
				},
				data: {
					title: data.title ? data.title : findTask.title,
					deadline: data.deadline ? new Date(data.deadline) : findTask.deadline,
					comment: data.comment ? data.comment : findTask.comment,
					statusId: data.status ? data.status : findTask.statusId,
					prioritiesId: data.priority ? data.priority : findTask.prioritiesId,
					updatedAt: new Date(),
				},
				select: {
					id: true,
					title: true,
					deadline: true,
					comment: true,
					Status: {
						select: {
							id: true,
							name: true,
						},
					},
					Priorities: {
						select: {
							id: true,
							name: true,
						},
					},
					User: {
						select: {
							id: true,
							email: true,
						},
					},
					createdAt: true,
					updatedAt: true,
				},
			});

			return updatedTask;
		} catch (error) {
			throw new HttpException(
				error.message ? error.message : "Error updating task",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async deleteOne(id: string, tokenPayload: PayloadDto): Promise<ResponseDeleteTasktDto> {
		try {
			const findTask = await this.prismaService.tasks.findFirst({
				where: {
					id: id,
				},
			});

			if (!findTask) throw new HttpException("Task not found", HttpStatus.NOT_FOUND);

			if (findTask.usersId !== tokenPayload.sub)
				throw new HttpException("Access denied", HttpStatus.FORBIDDEN);

			await this.prismaService.tasks.delete({
				where: {
					id: findTask.id,
				},
			});

			return { message: "Task deleted successfully" };
		} catch (error) {
			throw new HttpException(
				error.message ? error.message : "Error deleting task",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
