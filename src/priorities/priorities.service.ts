import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PrioritiesService {
	constructor(private prisma: PrismaService) {}

	async findAll() {
		try {
			const priorities = await this.prisma.priorities.findMany({
				select: {
					id: true,
					name: true,
				},
			});

			console.log(priorities);

			if (!priorities || priorities.length === 0)
				throw new HttpException("No priorities found", HttpStatus.NOT_FOUND);

			return priorities;
		} catch (error) {
			throw new HttpException("Error fetching priorities", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
