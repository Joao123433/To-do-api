import { Test, TestingModule } from "@nestjs/testing";
import { PrioritiesService } from "../priorities.service";
import { PrismaService } from "src/prisma/prisma.service";
import { HttpException, HttpStatus } from "@nestjs/common";

describe("PrioritiesService", () => {
	let prioritiesService: PrioritiesService;
	let prismaService: PrismaService;

	beforeAll(() => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date("2025-05-08T03:54:13.000Z"));
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PrioritiesService,
				{
					provide: PrismaService,
					useValue: {
						priorities: {
							findMany: jest.fn(),
						},
					},
				},
			],
		}).compile();

		prioritiesService = module.get<PrioritiesService>(PrioritiesService);
		prismaService = module.get<PrismaService>(PrismaService);
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	it("should be defined", () => {
		expect(prioritiesService).toBeDefined();
		expect(PrismaService).toBeDefined();
	});

	describe("FindAll", () => {
		it("should be find all priorities", async () => {
			const mockStatus = {
				id: "id-mock",
				name: "mockPriority",
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			jest.spyOn(prismaService.priorities, "findMany").mockResolvedValue([mockStatus]);
			const result = await prioritiesService.findAll();

			expect(prismaService.priorities.findMany).toHaveBeenCalledWith({
				select: {
					id: true,
					name: true,
				},
			});

			expect(result).toEqual([mockStatus]);
		});

		it("should return null if not find task", async () => {
			jest.spyOn(prismaService.priorities, "findMany").mockRejectedValue(new Error());

			await expect(prioritiesService.findAll()).rejects.toThrow(
				new HttpException("Error fetching priorities", HttpStatus.INTERNAL_SERVER_ERROR),
			);

			expect(prismaService.priorities.findMany).toHaveBeenCalledWith({
				select: {
					id: true,
					name: true,
				},
			});
		});
	});
});
