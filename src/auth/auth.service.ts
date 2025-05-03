import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { HashingServiceProtocol } from "./hash/hashing.service";
import jwtConfig from "./config/jwt-config";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private readonly hashingService: HashingServiceProtocol,

		@Inject(jwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
		private readonly jwtService: JwtService,
	) {}

	async autenticate(loginDto: LoginDto) {
		const findUser = await this.prisma.users.findFirst({
			where: {
				email: loginDto.email,
			},
		});

		if (!findUser) throw new HttpException("User login error", HttpStatus.UNAUTHORIZED);

		const passwordValidated = await this.hashingService.comparePassword(
			loginDto.password,
			findUser.passwordHash,
		);

		if (!passwordValidated)
			throw new HttpException("Incorrect username/password", HttpStatus.UNAUTHORIZED);

		const token = this.jwtService.signAsync(
			{
				sub: findUser.id,
				email: findUser.email,
			},
			{
				secret: this.jwtConfiguration.secret,
				audience: this.jwtConfiguration.audience,
				issuer: this.jwtConfiguration.issuer,
				expiresIn: this.jwtConfiguration.expiresIn,
			},
		);

		return {
			id: findUser.id,
			name: findUser.name,
			email: findUser.email,
			token: token,
		};
	}
}
