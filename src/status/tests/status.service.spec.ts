import { Test, TestingModule } from "@nestjs/testing";
import { StatusService } from "../status.service";
import { PrismaService } from "src/prisma/prisma.service";
import { HttpException, HttpStatus } from "@nestjs/common";

describe("StatusService", () => {
	let statusService: StatusService;
	let prismaService: PrismaService;

	beforeAll(() => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date("2025-05-08T03:54:13.000Z"));
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				StatusService,
				{
					provide: PrismaService,
					useValue: {
						status: {
							findMany: jest.fn(),
						},
					},
				},
			],
		}).compile();

		statusService = module.get<StatusService>(StatusService);
		prismaService = module.get<PrismaService>(PrismaService);
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	it("should be defined", () => {
		expect(statusService).toBeDefined();
		expect(prismaService).toBeDefined();
	});

	describe("FindAll", () => {
		it("Should be find All status", async () => {
			const mockStatus = {
				id: "id-mock",
				name: "mockStatus",
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			jest.spyOn(prismaService.status, "findMany").mockResolvedValue([mockStatus]);
			const result = await statusService.findAll();

			expect(prismaService.status.findMany).toHaveBeenCalledWith({
				select: {
					id: true,
					name: true,
				},
			});

			expect(result).toEqual([mockStatus]);
		});

		it("should return null if not find task", async () => {
			jest.spyOn(prismaService.status, "findMany").mockRejectedValue(new Error("Database error"));

			await expect(statusService.findAll()).rejects.toThrow(
				new HttpException("Error fetching status", HttpStatus.INTERNAL_SERVER_ERROR),
			);

			expect(prismaService.status.findMany).toHaveBeenCalledWith({
				select: {
					id: true,
					name: true,
				},
			});
		});
	});
});
