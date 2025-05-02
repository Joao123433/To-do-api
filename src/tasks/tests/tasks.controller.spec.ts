import { TasksController } from "../tasks.controller";

describe("TasksController", () => {
	let controller: TasksController;

	const tasksServiceMock = {
		findAll: jest.fn(),
		findOne: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	};

	beforeAll(() => {
		controller = new TasksController(tasksServiceMock as any);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
