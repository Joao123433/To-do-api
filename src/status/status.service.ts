import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class StatusService {
	constructor(private prisma: PrismaService) {}

	async findAll() {
		try {
			const status = await this.prisma.status.findMany({
				select: {
					id: true,
					name: true,
				},
			});

			if (!status || status.length === 0) throw new Error("No status found");

			return status;
		} catch (error) {
			throw new HttpException("Error fetching status", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
