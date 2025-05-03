import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { TOKEN_PAYLOAD } from "../commom/auth.constant";

export const TokenPayload = createParamDecorator((data: unknown, context: ExecutionContext) => {
	const ctx = context.switchToHttp();
	const request = ctx.getRequest();
	return request[TOKEN_PAYLOAD];
});
