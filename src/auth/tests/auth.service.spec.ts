import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { PrismaService } from "src/prisma/prisma.service";
import { HashingServiceProtocol } from "../hash/hashing.service";
import { ConfigModule } from "@nestjs/config";
import jwtConfig from "../config/jwt-config";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "../dto/login.dto";
import { HttpException, HttpStatus } from "@nestjs/common";

const mockUser = {
	id: "mock-user-id",
	name: "user",
	email: "user@user.com",
	password: "Test12&",
	createdAt: new Date(),
	updatedAt: new Date(),
};

const loginDto: LoginDto = {
	email: "user@user.com",
	password: "Test12&",
};

describe("AuthService", () => {
	let authService: AuthService;
	let prismaService: PrismaService;
	let hashingService: HashingServiceProtocol;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule.forFeature(jwtConfig)],
			providers: [
				AuthService,
				JwtService,
				{
					provide: PrismaService,
					useValue: {
						users: {
							findFirst: jest.fn(),
						},
					},
				},
				{
					provide: HashingServiceProtocol,
					useValue: {
						comparePassword: jest.fn(),
					},
				},
			],
		}).compile();

		authService = module.get<AuthService>(AuthService);
		prismaService = module.get<PrismaService>(PrismaService);
		hashingService = module.get<HashingServiceProtocol>(HashingServiceProtocol);
	});

	it("should be defined", () => {
		expect(authService).toBeDefined();
		expect(prismaService).toBeDefined();
		expect(hashingService).toBeDefined();
	});

	describe("Login", () => {
		it("should be login successfully", async () => {
			jest.spyOn(prismaService.users, "findFirst").mockResolvedValue(mockUser);
			jest.spyOn(hashingService, "comparePassword").mockResolvedValue(true);

			await authService.autenticate(loginDto);

			expect(prismaService.users.findFirst).toHaveBeenCalledWith({
				where: {
					email: loginDto.email,
				},
			});

			expect(hashingService.comparePassword).toHaveBeenCalled();
		});

		it("should thorw exception when user is not found", async () => {
			jest.spyOn(prismaService.users, "findFirst").mockResolvedValue(null);

			await expect(authService.autenticate(loginDto)).rejects.toThrow(
				new HttpException("User login error", HttpStatus.BAD_REQUEST),
			);
		});

		it("should thorw exception when user is not found", async () => {
			jest.spyOn(prismaService.users, "findFirst").mockResolvedValue(mockUser);
			jest.spyOn(hashingService, "comparePassword").mockResolvedValue(false);

			await expect(authService.autenticate(loginDto)).rejects.toThrow(
				new HttpException("Incorrect username/password", HttpStatus.BAD_REQUEST),
			);
		});
	});
});
