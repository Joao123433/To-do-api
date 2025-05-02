import { Test, TestingModule } from "@nestjs/testing";
import { TasksService } from "../tasks.service";
import { PrismaService } from "src/prisma/prisma.service";

describe("TasksService", () => {
	let taskService: TasksService;
	let prismaService: PrismaService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TasksService,
				{
					provide: PrismaService,
					useValue: {
						task: {
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

	it("should be defined", () => {
		expect(taskService).toBeDefined();
		expect(prismaService).toBeDefined();
	});
});
