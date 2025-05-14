import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../users.service";
import { PrismaService } from "src/prisma/prisma.service";
import { PayloadDto } from "src/auth/dto/payload.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { HashingServiceProtocol } from "src/auth/hash/hashing.service";
import { UpdateUserDto } from "../dto/update.dto";

const mockUser = {
	id: "mock-user-id",
	name: "user",
	email: "user@user.com",
	password: "Test12&",
	createdAt: new Date(),
	updatedAt: new Date(),
	tasks: {
		id: "task-id",
		title: "task",
		deadline: new Date(),
		comment: "comment",
		Status: {
			id: "status-id",
			name: "name",
		},
		Priorities: {
			id: "priorities-id",
			name: "name",
		},
	},
};

const tokenPayload: PayloadDto = {
	sub: "mock-user-id",
	email: "test@test.com",
	iat: 123,
	exp: 123,
	aud: "",
	iss: "",
};

const tokenPayloadReject: PayloadDto = {
	...tokenPayload,
	sub: "2",
};

const updateUserDto: UpdateUserDto = {
	name: "teste 2",
	email: "test@test.com",
	password: "7654321",
};

const updatedUser = {
	id: "HASH_MOCK_EXEMPLO_NOVO",
	name: "teste 2",
	email: "teste2@teste.com",
	password: "HASH_MOCK_EXEMPLO_NOVO",
	createdAt: new Date(),
	updatedAt: new Date(),
};

const userDto = {
	id: "id-user",
	name: "test",
	email: "test@test.com",
	password: "Test12&",
	createdAt: new Date(),
	updatedAt: new Date(),
};

describe("UsersService", () => {
	let usersService: UsersService;
	let prismaService: PrismaService;
	let hashingService: HashingServiceProtocol;

	beforeAll(() => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date("2025-05-08T03:54:13.000Z"));
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: PrismaService,
					useValue: {
						users: {
							create: jest.fn(),
							findFirst: jest.fn(),
							update: jest.fn(),
							delete: jest.fn(),
						},
					},
				},
				{
					provide: HashingServiceProtocol,
					useValue: {
						hashPassword: jest.fn(),
					},
				},
			],
		}).compile();

		usersService = module.get<UsersService>(UsersService);
		prismaService = module.get<PrismaService>(PrismaService);
		hashingService = module.get<HashingServiceProtocol>(HashingServiceProtocol);
	});

	afterAll(() => {
		jest.useRealTimers();
		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(usersService).toBeDefined();
		expect(prismaService).toBeDefined();
	});

	describe("Find One user", () => {
		it("should return a user found", async () => {
			jest.spyOn(prismaService.users, "findFirst").mockResolvedValue(mockUser);
			const result = await usersService.getUser(tokenPayload);

			expect(prismaService.users.findFirst).toHaveBeenLastCalledWith({
				where: {
					id: tokenPayload.sub,
				},
				select: {
					id: true,
					name: true,
					email: true,
					createdAt: true,
					updatedAt: true,
					tasks: {
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
						},
					},
				},
			});

			expect(result).toEqual(mockUser);
		});

		it("should thorw error exception when user is not found", async () => {
			jest.spyOn(prismaService.users, "findFirst").mockResolvedValue(null);

			// espera um erro caso seja passado o id 1 para o a funcao findOne
			await expect(usersService.getUser(tokenPayloadReject)).rejects.toThrow(
				new HttpException("Failed to get user", HttpStatus.NOT_FOUND),
			);

			expect(prismaService.users.findFirst).toHaveBeenCalledWith({
				where: {
					id: tokenPayloadReject.sub,
				},
				select: {
					id: true,
					name: true,
					email: true,
					createdAt: true,
					updatedAt: true,
					tasks: {
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
						},
					},
				},
			});
		});
	});

	describe("Create User", () => {
		it("should create user new user", async () => {
			jest.spyOn(hashingService, "hashPassword").mockResolvedValue("HASH_MOCK_EXEMPLO");
			jest.spyOn(prismaService.users, "create").mockResolvedValue(userDto);

			const result = await usersService.create(userDto);

			expect(hashingService.hashPassword).toHaveBeenCalled();

			expect(prismaService.users.create).toHaveBeenCalledWith({
				data: {
					name: userDto.name,
					email: userDto.email,
					password: "HASH_MOCK_EXEMPLO",
				},
				select: {
					id: true,
					name: true,
					email: true,
					createdAt: true,
					updatedAt: true,
				},
			});

			expect(result).toEqual(userDto);
		});

		it("should thorw error if prisma create fails", async () => {
			jest.spyOn(hashingService, "hashPassword").mockResolvedValue("HASH_MOCK_EXEMPLO");
			jest
				.spyOn(prismaService.users, "create")
				.mockRejectedValue(new Error("Failed to create user"));

			await expect(usersService.create(userDto)).rejects.toThrow(
				new HttpException("Failed to create user", HttpStatus.BAD_REQUEST),
			);

			expect(hashingService.hashPassword).toHaveBeenCalledWith(userDto.password);

			expect(prismaService.users.create).toHaveBeenCalledWith({
				data: {
					name: userDto.name,
					email: userDto.email,
					password: "HASH_MOCK_EXEMPLO",
				},
				select: {
					id: true,
					name: true,
					email: true,
					createdAt: true,
					updatedAt: true,
				},
			});
		});

		it("should thorw exception when user is not found", async () => {
			jest
				.spyOn(prismaService.users, "create")
				.mockRejectedValue(new Error("Failed to create user"));

			await expect(usersService.create(userDto)).rejects.toThrow(
				new HttpException("Failed to create user", HttpStatus.INTERNAL_SERVER_ERROR),
			);
		});
	});

	describe("Update User", () => {
		it("should user updated", async () => {
			jest.spyOn(prismaService.users, "findFirst").mockResolvedValue(mockUser);
			jest.spyOn(hashingService, "hashPassword").mockResolvedValue("HASH_MOCK_EXEMPLO_NOVO");
			jest.spyOn(prismaService.users, "update").mockResolvedValue(updatedUser);

			const result = await usersService.update(updateUserDto, tokenPayload);

			expect(hashingService.hashPassword).toHaveBeenCalledWith(updateUserDto.password);

			expect(prismaService.users.update).toHaveBeenCalledWith({
				where: {
					id: tokenPayload.sub,
				},
				data: {
					email: updateUserDto.email,
					name: updateUserDto.name,
					password: "HASH_MOCK_EXEMPLO_NOVO",
					updatedAt: new Date(),
				},
				select: {
					id: true,
					name: true,
					email: true,
				},
			});

			expect(result).toEqual(updatedUser);
		});

		it("should throw UNAUTHORIZED exception when user is not authorized", async () => {
			jest.spyOn(prismaService.users, "findFirst").mockResolvedValue(mockUser);

			await expect(usersService.update(updateUserDto, tokenPayloadReject)).rejects.toThrow(
				new HttpException("You cannot update this user", HttpStatus.INTERNAL_SERVER_ERROR),
			);
		});

		it("should thorw exception when user is not found", async () => {
			jest.spyOn(prismaService.users, "findFirst").mockResolvedValue(null);

			await expect(usersService.update(updateUserDto, tokenPayload)).rejects.toThrow(
				new HttpException("User not found", HttpStatus.BAD_REQUEST),
			);
		});
	});

	describe("Delete User", () => {
		it("should user deleted", async () => {
			jest.spyOn(prismaService.users, "findFirst").mockResolvedValue(mockUser);
			jest.spyOn(prismaService.users, "delete").mockResolvedValue(mockUser);

			const result = await usersService.delete(tokenPayload);

			expect(prismaService.users.delete).toHaveBeenCalledWith({
				where: {
					id: tokenPayload.sub,
				},
			});

			expect(result).toEqual({
				message: "User deleted successfully",
			});
		});

		it("should thorw exception when user is not found", async () => {
			jest.spyOn(prismaService.users, "findFirst").mockResolvedValue(null);

			await expect(usersService.delete(tokenPayload)).rejects.toThrow(
				new HttpException("User not found", HttpStatus.BAD_REQUEST),
			);
		});

		it("should throw UNAUTHORIZED exception when user is not authorized", async () => {
			jest.spyOn(prismaService.users, "findFirst").mockResolvedValue(mockUser);

			await expect(usersService.delete(tokenPayloadReject)).rejects.toThrow(
				new HttpException("You cannot delete this user", HttpStatus.BAD_REQUEST),
			);

			expect(prismaService.users.delete).not.toHaveBeenCalled();
		});
	});
});
