import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ResponseStatusDto } from "./dto/response.dto";

@Injectable()
export class StatusService {
	constructor(private prisma: PrismaService) {}

	async findAll(): Promise<ResponseStatusDto[]> {
		try {
			const status = await this.prisma.status.findMany({
				select: {
					id: true,
					name: true,
				},
			});

			return status;
		} catch (error) {
			throw new HttpException("Error fetching status", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
