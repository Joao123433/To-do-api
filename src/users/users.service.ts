import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PayloadDto } from "src/auth/dto/payload.dto";
import { CreateUserDto } from "./dto/create.dto";
import { UpdateUserDto } from "./dto/update.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { HashingServiceProtocol } from "src/auth/hash/hashing.service";

@Injectable()
export class UsersService {
	constructor(
		private prismaService: PrismaService,
		private hashingService: HashingServiceProtocol,
	) {}

	async getUser(tokenPayload: PayloadDto) {
		const findUser = await this.prismaService.users.findFirst({
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

		if (!findUser) throw new HttpException("User not found", HttpStatus.NOT_FOUND);

		return findUser;
	}

	async create(createUserDto: CreateUserDto) {
		try {
			const passwordHash = await this.hashingService.hashPassword(createUserDto.password);

			const user = this.prismaService.users.create({
				data: {
					name: createUserDto.name,
					email: createUserDto.email,
					password: passwordHash,
				},
				select: {
					id: true,
					name: true,
					email: true,
					createdAt: true,
					updatedAt: true,
				},
			});

			return user;
		} catch (error) {
			throw new HttpException(
				"Failed to create user",
				error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async update(updateUserDto: UpdateUserDto, tokenPayload: PayloadDto) {
		const findUser = await this.prismaService.users.findFirst({
			where: {
				id: tokenPayload.sub,
			},
		});

		if (!findUser) throw new HttpException("User not found", HttpStatus.NOT_FOUND);

		if (findUser.id !== tokenPayload.sub)
			throw new HttpException("You cannot update this user", HttpStatus.FORBIDDEN);

		const dataUser: { name?: string; email?: string; password?: string } = {
			name: updateUserDto.name ? updateUserDto.name : findUser.name,
			email: updateUserDto.email ? updateUserDto.email : findUser.email,
		};

		if (updateUserDto.password) {
			const passwordHash = await this.hashingService.hashPassword(updateUserDto.password);
			dataUser.password = passwordHash;
		}

		const user = await this.prismaService.users.update({
			where: {
				id: findUser.id,
			},
			data: {
				...dataUser,
				password: dataUser.password ? dataUser.password : findUser.password,
				updatedAt: new Date(),
			},
			select: {
				id: true,
				name: true,
				email: true,
			},
		});

		return user;
	}

	async delete(tokenPayload: PayloadDto) {
		const findUser = await this.prismaService.users.findFirst({
			where: {
				id: tokenPayload.sub,
			},
		});

		if (!findUser) throw new HttpException("User not found", HttpStatus.NOT_FOUND);
		if (findUser.id !== tokenPayload.sub)
			throw new HttpException("You cannot delete this user", HttpStatus.FORBIDDEN);

		this.prismaService.users.delete({
			where: {
				id: findUser.id,
			},
		});

		return {
			message: "User deleted successfully",
		};
	}
}
