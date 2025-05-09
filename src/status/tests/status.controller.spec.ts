import { Test, TestingModule } from "@nestjs/testing";
import { StatusController } from "../status.controller";

describe("StatusController", () => {
	let controller: StatusController;

	const statusServiceMock = {
		findAll: jest.fn(),
	};

	beforeAll(() => {
		controller = new StatusController(statusServiceMock as any);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	it("should all status", async () => {
		await controller.findAll();
		expect(statusServiceMock.findAll).toHaveBeenCalled();
	});
});
