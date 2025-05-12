import { Body, Controller, Delete, Get, Patch, Post, UseInterceptors } from "@nestjs/common";
import { PayloadDto } from "src/auth/dto/payload.dto";
import { TokenPayload } from "src/auth/params/token-payload.param";
import { LoggerInterceptor } from "src/commom/interceptors/logger.interceptor";
import { CreateUserDto } from "./dto/create.dto";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update.dto";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("users")
@UseInterceptors(LoggerInterceptor)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@ApiBearerAuth()
	get(@TokenPayload() tokenPayload: PayloadDto) {
		return this.usersService.getUser(tokenPayload);
	}

	@Post()
	createUser(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Patch()
	@ApiBearerAuth()
	updateUser(@Body() body: UpdateUserDto, @TokenPayload() tokenPayload: PayloadDto) {
		return this.usersService.update(body, tokenPayload);
	}

	@Delete()
	@ApiBearerAuth()
	deleteUser(@TokenPayload() tokenPayload: PayloadDto) {
		return this.usersService.delete(tokenPayload);
	}
}
