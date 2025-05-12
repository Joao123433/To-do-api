import { UsersController } from "../users.controller";
import { PayloadDto } from "src/auth/dto/payload.dto";
import { CreateUserDto } from "../dto/create.dto";
import { UpdateUserDto } from "../dto/update.dto";

const tokenPayload: PayloadDto = {
	sub: "mock-user-id",
	email: "test@test.com",
	iat: 123,
	exp: 123,
	aud: "",
	iss: "",
};

describe("UsersController", () => {
	let controller: UsersController;

	const usersServiceMock = {
		getUser: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	};

	beforeAll(() => {
		controller = new UsersController(usersServiceMock as any);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	it("should find one user", async () => {
		await controller.get(tokenPayload);

		expect(usersServiceMock.getUser).toHaveBeenCalledWith(tokenPayload);
	});

	it("should create one user", async () => {
		const userDto: CreateUserDto = {
			name: "test",
			email: "teste@test.com",
			password: "1234567",
		};

		const mockUser = {
			id: 1,
			name: "test",
			email: "teste@test.com",
		};

		jest.spyOn(usersServiceMock, "create").mockResolvedValue(mockUser);
		const result = await controller.createUser(userDto);

		expect(usersServiceMock.create).toHaveBeenCalledWith(userDto);
		expect(result).toEqual(mockUser);
	});

	it("should updated one user", async () => {
		const userDto: UpdateUserDto = {
			name: "test 2",
		};

		const mockUser = {
			id: "id",
			name: "test",
			email: "teste@test.com",
		};

		jest.spyOn(usersServiceMock, "update").mockResolvedValue(mockUser);
		const result = await controller.updateUser(userDto, tokenPayload);

		expect(usersServiceMock.update).toHaveBeenCalledWith(userDto, tokenPayload);
		expect(result).toEqual(mockUser);
	});

	it("should delete one user", async () => {
		await controller.deleteUser(tokenPayload);

		expect(usersServiceMock.delete).toHaveBeenCalledWith(tokenPayload);
	});
});
