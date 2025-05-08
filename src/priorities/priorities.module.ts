import { Module } from "@nestjs/common";
import { PrioritiesController } from "./priorities.controller";
import { PrioritiesService } from "./priorities.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
	imports: [PrismaModule],
	controllers: [PrioritiesController],
	providers: [PrioritiesService],
	exports: [PrioritiesService],
})
export class PrioritiesModule {}
