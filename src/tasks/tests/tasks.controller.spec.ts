import { CreateTaskDto } from "../dto/create.dto";
import { UpdateTaskDto } from "../dto/update.dto";
import { TasksController } from "../tasks.controller";

describe("TasksController", () => {
	let controller: TasksController;

	const tasksServiceMock = {
		findAll: jest.fn(),
		findOne: jest.fn(),
		createOne: jest.fn(),
		updateOne: jest.fn(),
		deleteOne: jest.fn(),
	};

	beforeAll(() => {
		controller = new TasksController(tasksServiceMock as any);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	it("should all tasks", async () => {
		await controller.findAll({ limit: 0, offset: 0 });
		expect(tasksServiceMock.findAll).toHaveBeenCalledWith({
			limit: 0,
			offset: 0,
		});
	});

	it("should find one task", async () => {
		const id = "mock-id";
		await controller.findOne(id);
		expect(tasksServiceMock.findOne).toHaveBeenCalledWith(id);
	});

	it("should create a task", async () => {
		const taskDto: CreateTaskDto = {
			title: "Title",
			comment: "Comment",
			deadline: new Date().toDateString(),
			priority: "low",
			status: "todo",
		};

		const mockTaks = {
			...taskDto,
			id: "mock-id",
		};

		jest.spyOn(tasksServiceMock, "createOne").mockResolvedValue(mockTaks);
		const result = await controller.create(taskDto);

		expect(tasksServiceMock.createOne).toHaveBeenCalledWith(taskDto);
		expect(result).toEqual(mockTaks);
	});

	it("should update a task", async () => {
		const id = "mock-id";

		const taskDto: UpdateTaskDto = {
			title: "Title",
			comment: "Comment",
			deadline: new Date().toDateString(),
			priority: "low",
			status: "todo",
		};

		const mockTaks = {
			...taskDto,
			id,
		};

		jest.spyOn(tasksServiceMock, "updateOne").mockResolvedValue(mockTaks);
		const result = await controller.update(id, taskDto);

		expect(tasksServiceMock.updateOne).toHaveBeenCalledWith(id, taskDto);
		expect(result).toEqual(mockTaks);
	});

	it("should delete a task", async () => {
		const id = "mock-id";

		jest.spyOn(tasksServiceMock, "deleteOne").mockResolvedValue(true);
		const result = await controller.delete(id);

		expect(tasksServiceMock.deleteOne).toHaveBeenCalledWith(id);
		expect(result).toEqual(true);
	});
});
