import { Controller, UseInterceptors } from "@nestjs/common";
import { LoggerInterceptor } from "src/commom/interceptors/logger.interceptor";

@Controller("users")
@UseInterceptors(LoggerInterceptor)
export class UsersController {}
