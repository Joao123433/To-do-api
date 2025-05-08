import { Test, TestingModule } from "@nestjs/testing";
import { TasksService } from "../tasks.service";
import { PrismaService } from "src/prisma/prisma.service";
import { PayloadDto } from "src/auth/dto/payload.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { CreateTaskDto } from "../dto/create.dto";
import { UpdateTaskDto } from "../dto/update.dto";

const mockTask = {
	id: "mock-id",
	title: "Mock Task",
	deadline: new Date(),
	comment: "Mock comment",
	createdAt: new Date(),
	updatedAt: new Date(),
	usersId: "mock-user-id",
	statusId: "mock-status-id",
	prioritiesId: "mock-priority-id",
};

const mockTaskList = [mockTask];

const tokenPayload: PayloadDto = {
	sub: "mock-user-id",
	email: "teste@teste.com",
	iat: 123,
	exp: 123,
	aud: "",
	iss: "",
};

const tokenPayloadReject: PayloadDto = {
	...tokenPayload,
	sub: "2",
};

const taskDto: CreateTaskDto = {
	title: "Mock Task",
	deadline: new Date().toDateString(),
	comment: "Mock comment",
	status: "mock-status-id",
	priority: "mock-priority-id",
};

const updateTaskDto: UpdateTaskDto = {
	...taskDto,
};

describe("TasksService", () => {
	let taskService: TasksService;
	let prismaService: PrismaService;

	beforeAll(() => {
		jest.useFakeTimers(); // Habilita fake timers
		jest.setSystemTime(new Date("2025-05-08T03:54:13.000Z")); // Congela o tempo
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TasksService,
				{
					provide: PrismaService,
					useValue: {
						tasks: {
							findMany: jest.fn(),
							findFirst: jest.fn(),
							create: jest.fn(),
							update: jest.fn(),
							delete: jest.fn(),
						},
					},
				},
			],
		}).compile();

		taskService = module.get<TasksService>(TasksService);
		prismaService = module.get<PrismaService>(PrismaService);
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	it("should be defined", () => {
		expect(taskService).toBeDefined();
		expect(prismaService).toBeDefined();
	});

	describe("FindAll", () => {
		it("should return an array of tasks", async () => {
			const pagination = { limit: 10, offset: 0 };

			jest.spyOn(prismaService.tasks, "findMany").mockResolvedValue(mockTaskList);
			const result = await taskService.findAll(pagination, tokenPayload);

			expect(prismaService.tasks.findMany).toHaveBeenCalledWith({
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
				take: pagination.limit,
				skip: pagination.offset,
			});

			expect(result).toEqual(mockTaskList);
		});

		it("should throw an error if findMany fails", async () => {
			const pagination = { limit: 10, offset: 0 };

			jest.spyOn(prismaService.tasks, "findMany").mockRejectedValue(new Error("Database error"));

			await expect(taskService.findAll(pagination, tokenPayload)).rejects.toThrow(
				new HttpException("Error fetching tasks", HttpStatus.INTERNAL_SERVER_ERROR),
			);

			expect(prismaService.tasks.findMany).toHaveBeenCalledWith({
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
				take: pagination.limit,
				skip: pagination.offset,
			});
		});
	});

	describe("FindOne", () => {
		it("should return a task", async () => {
			jest.spyOn(prismaService.tasks, "findFirst").mockResolvedValue(mockTask);

			const result = await taskService.findOne(mockTask.id);

			expect(prismaService.tasks.findFirst).toHaveBeenCalledWith({
				where: {
					id: mockTask.id,
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

			expect(result).toEqual(mockTask);
		});

		it("should throw an error if findFirst fails", async () => {
			jest.spyOn(prismaService.tasks, "findFirst").mockRejectedValue(new Error("Database error"));

			await expect(taskService.findOne(mockTask.id)).rejects.toThrow(
				new HttpException("Error fetching tasks", HttpStatus.INTERNAL_SERVER_ERROR),
			);

			expect(prismaService.tasks.findFirst).toHaveBeenCalledWith({
				where: {
					id: mockTask.id,
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
		});

		it("should return null if not find task", async () => {
			jest.spyOn(prismaService.tasks, "findFirst").mockResolvedValue(null);

			await expect(taskService.findOne("1")).rejects.toThrow(
				new HttpException("Error fetching tasks", HttpStatus.NOT_FOUND),
			);

			expect(prismaService.tasks.findFirst).toHaveBeenCalledWith({
				where: {
					id: "1",
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
		});
	});

	describe("Create", () => {
		it("should create a task", async () => {
			jest.spyOn(prismaService.tasks, "create").mockResolvedValue(mockTask);
			const result = await taskService.createOne(taskDto, tokenPayload);

			expect(prismaService.tasks.create).toHaveBeenCalledWith({
				data: {
					title: taskDto.title,
					deadline: new Date(taskDto.deadline),
					comment: taskDto.comment,
					statusId: taskDto.status,
					prioritiesId: taskDto.priority,
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

			expect(result).toEqual(mockTask);
		});

		it("should thorw error if prisma create fails", async () => {
			jest.spyOn(prismaService.tasks, "create").mockRejectedValue(new Error("Error creating task"));

			await expect(taskService.createOne(taskDto, tokenPayload)).rejects.toThrow(
				new HttpException("Error creating task", HttpStatus.INTERNAL_SERVER_ERROR),
			);

			expect(prismaService.tasks.create).toHaveBeenCalledWith({
				data: {
					title: taskDto.title,
					deadline: new Date(taskDto.deadline),
					comment: taskDto.comment,
					statusId: taskDto.status,
					prioritiesId: taskDto.priority,
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
		});
	});

	describe("Update", () => {
		it("should task updated", async () => {
			jest.spyOn(prismaService.tasks, "findFirst").mockResolvedValue(mockTask);
			jest.spyOn(prismaService.tasks, "update").mockResolvedValue(mockTask);

			const result = await taskService.updateOne("mock-id", updateTaskDto, tokenPayload);

			expect(prismaService.tasks.update).toHaveBeenCalledWith({
				where: {
					id: "mock-id",
				},
				data: {
					title: updateTaskDto.title ? updateTaskDto.title : result.title,
					deadline: updateTaskDto.deadline ? new Date(updateTaskDto.deadline) : result.deadline,
					comment: updateTaskDto.comment ? updateTaskDto.comment : result.comment,
					statusId: updateTaskDto.status ? updateTaskDto.status : result.Status,
					prioritiesId: updateTaskDto.priority ? updateTaskDto.priority : result.Priorities,
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
		});

		it("should thorw error if prisma create fails", async () => {
			jest.spyOn(prismaService.tasks, "update").mockRejectedValue(new Error("Error creating task"));

			await expect(taskService.updateOne("1", taskDto, tokenPayload)).rejects.toThrow(
				new HttpException("Task not found", HttpStatus.INTERNAL_SERVER_ERROR),
			);
		});

		it("should thorw exception when task is not found", async () => {
			jest.spyOn(prismaService.tasks, "findFirst").mockResolvedValue(null);

			await expect(taskService.updateOne("1", updateTaskDto, tokenPayload)).rejects.toThrow(
				new HttpException("Task not found", HttpStatus.INTERNAL_SERVER_ERROR),
			);

			expect(prismaService.tasks.findFirst).toHaveBeenCalledWith({
				where: {
					id: "1",
				},
			});
		});

		it("should throw UNAUTHORIZED exception when user is not authorized", async () => {
			jest.spyOn(prismaService.tasks, "findFirst").mockResolvedValue(mockTask);

			await expect(taskService.updateOne("1", updateTaskDto, tokenPayloadReject)).rejects.toThrow(
				new HttpException("Access denied", HttpStatus.INTERNAL_SERVER_ERROR),
			);

			expect(prismaService.tasks.delete).not.toHaveBeenCalled();
		});
	});

	describe("Delete", () => {
		it("should task deleted", async () => {
			jest.spyOn(prismaService.tasks, "findFirst").mockResolvedValue(mockTask);
			jest.spyOn(prismaService.tasks, "delete").mockResolvedValue(mockTask);

			const result = await taskService.deleteOne("mock-id", tokenPayload);

			expect(prismaService.tasks.delete).toHaveBeenCalledWith({
				where: {
					id: mockTask.id,
				},
			});

			expect(result).toEqual({
				message: "Task deleted successfully",
			});
		});

		it("should thorw exception when task is not found", async () => {
			jest.spyOn(prismaService.tasks, "findFirst").mockResolvedValue(null);

			await expect(taskService.deleteOne("1", tokenPayload)).rejects.toThrow(
				new HttpException("Task not found", HttpStatus.INTERNAL_SERVER_ERROR),
			);

			expect(prismaService.tasks.findFirst).toHaveBeenCalledWith({
				where: {
					id: "1",
				},
			});
		});

		it("should throw UNAUTHORIZED exception when user is not authorized", async () => {
			jest.spyOn(prismaService.tasks, "findFirst").mockResolvedValue(mockTask);

			await expect(taskService.deleteOne("1", tokenPayloadReject)).rejects.toThrow(
				new HttpException("Access denied", HttpStatus.INTERNAL_SERVER_ERROR),
			);

			expect(prismaService.tasks.delete).not.toHaveBeenCalled();
		});
	});
});
