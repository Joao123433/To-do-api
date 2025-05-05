import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ApiExceptionFilter } from "src/commom/filters/exception-filter";
import { TasksModule } from "src/tasks/tasks.module";
import { AuthModule } from "src/auth/auth.module";
import { UsersModule } from "src/users/users.module";
import { AuthMiddleware } from "src/commom/middlewares/auth.middleware";

@Module({
	imports: [TasksModule, UsersModule, AuthModule],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: "APP_FILTER",
			useClass: ApiExceptionFilter,
		},
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes({
			path: "*",
			method: RequestMethod.ALL,
		});
	}
}
