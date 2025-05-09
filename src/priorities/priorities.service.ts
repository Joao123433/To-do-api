import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ResponsePrioritiesDto } from "./dto/responde.dto";

@Injectable()
export class PrioritiesService {
	constructor(private prisma: PrismaService) {}

	async findAll(): Promise<ResponsePrioritiesDto[]> {
		try {
			const priorities = await this.prisma.priorities.findMany({
				select: {
					id: true,
					name: true,
				},
			});

			return priorities;
		} catch (error) {
			throw new HttpException("Error fetching priorities", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
