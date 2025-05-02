import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PaginationDto } from "src/commom/dto/pagination.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTaskDto } from "./dto/create.dto";
import { UpdateTaskDto } from "./dto/update.dto";

@Injectable()
export class TasksService {
	constructor(private prismaService: PrismaService) {}

	async findAll(pagination: PaginationDto) {
		try {
			const { limit, offset = 0 } = pagination;

			const tasks = await this.prismaService.tasks.findMany({
				select: {
					id: true,
					title: true,
					deadline: true,
					comment: true,
					status: true,
					priority: true,
					createdAt: true,
					updatedAt: true,
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

	async findOne(id: string) {
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
					status: true,
					priority: true,
				},
			});

			if (!task) throw new HttpException("Task not found", HttpStatus.NOT_FOUND);

			return task;
		} catch (error) {
			throw new HttpException(
				error.messgem ? error.message : "Error fetching tasks",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async createOne(data: CreateTaskDto) {
		try {
			const task = await this.prismaService.tasks.create({
				data: {
					title: data.title,
					deadline: new Date(data.deadline),
					comment: data.comment,
					status: data.status,
					priority: data.priority,
				},
				select: {
					id: true,
					title: true,
					deadline: true,
					comment: true,
					status: true,
					priority: true,
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

	async updateOne(id: string, data: UpdateTaskDto) {
		try {
			const findTask = await this.prismaService.tasks.findFirst({
				where: {
					id: id,
				},
			});

			if (!findTask) throw new HttpException("Task not found", HttpStatus.NOT_FOUND);

			const updatedTask = await this.prismaService.tasks.update({
				where: {
					id: findTask.id,
				},
				data: {
					title: data.title ? data.title : findTask.title,
					deadline: data.deadline ? new Date(data.deadline) : findTask.deadline,
					comment: data.comment ? data.comment : findTask.comment,
					status: data.status ? data.status : findTask.status,
					priority: data.priority ? data.priority : findTask.priority,
					updatedAt: new Date(),
				},
				select: {
					id: true,
					title: true,
					deadline: true,
					comment: true,
					status: true,
					priority: true,
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

	async deleteOne(id: string) {
		try {
			const findTask = await this.prismaService.tasks.findFirst({
				where: {
					id: id,
				},
			});

			if (!findTask) throw new HttpException("Task not found", HttpStatus.NOT_FOUND);

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
