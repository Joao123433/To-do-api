import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ApiExceptionFilter } from "src/commom/filters/exception-filter";
import { TasksModule } from "src/tasks/tasks.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
	imports: [TasksModule, AuthModule],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: "APP_FILTER",
			useClass: ApiExceptionFilter,
		},
	],
})
export class AppModule {}
