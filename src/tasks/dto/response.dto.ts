export class ResponseTaksDto {
	id: string;
	title: string;
	deadline: Date;
	comment: string;
	createdAt: Date | null;
	updatedAt: Date | null;
	User: {
		id: string;
		email: string;
	};
	Status: {
		id: string;
		name: string;
	};
	Priorities: {
		id: string;
		name: string;
	};
}

export class ResponseDeleteTasktDto {
	message: string;
}
