export class ResponseFindUserDto {
	id: string;
	name: string;
	email: string;
	createdAt: Date | null;
	updatedAt: Date | null;
	tasks: {
		id: string;
		title: string;
		deadline: Date;
		comment: string;
		Status: {
			id: string;
			name: string;
		};
		Priorities: {
			id: string;
			name: string;
		};
	}[];
}

export class ResponseCreateUserDto {
	id: string;
	name: string;
	email: string;
	createdAt: Date | null;
	updatedAt: Date | null;
}

export class ResponseUpdateUserDto {
	id: string;
	name: string;
	email: string;
}

export class ResponseDeleteUserDto {
	message: string;
}
