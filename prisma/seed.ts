import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	const statuses = ["To-Do", "In Progress", "Done"];
	const priorites = ["Low", "Medium", "High"];

	statuses.forEach(async (status) => {
		await prisma.status.upsert({
			where: { name: status },
			update: {},
			create: {
				name: status,
			},
		});
	});

	priorites.forEach(async (priority) => {
		await prisma.priorities.upsert({
			where: { name: priority },
			update: {},
			create: {
				name: priority,
			},
		});
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
