import { PrioritiesController } from "../priorities.controller";

describe("PrioritiesController", () => {
	let controller: PrioritiesController;

	const prioritiesServiceMock = {
		findAll: jest.fn(),
	};

	beforeAll(() => {
		controller = new PrioritiesController(prioritiesServiceMock as any);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	it("should all priorities", async () => {
		await controller.findAll();
		expect(prioritiesServiceMock.findAll).toHaveBeenCalled();
	});
});
