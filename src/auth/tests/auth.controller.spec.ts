import { AuthController } from "../auth.controller";
import { LoginDto } from "../dto/login.dto";

const loginDto: LoginDto = {
	email: "user@user.com",
	password: "Test12&",
};

describe("AuthController", () => {
	let controller: AuthController;

	const authServiceMock = {
		autenticate: jest.fn(),
	};

	beforeAll(() => {
		controller = new AuthController(authServiceMock as any);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	it("should login", async () => {
		await controller.login(loginDto);
		expect(authServiceMock.autenticate).toHaveBeenCalledWith(loginDto);
	});
});
