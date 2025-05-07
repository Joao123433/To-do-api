import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app/app.module";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);

	const config = new DocumentBuilder()
		.setTitle("Todo Api")
		.setDescription("Todo API description")
		.addBearerAuth()
		.setVersion("1.0")
		.build();

	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("docs", app, documentFactory);

	await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
