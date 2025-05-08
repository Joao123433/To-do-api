import { HttpException, HttpStatus, Inject, NestMiddleware } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { TOKEN_PAYLOAD } from "src/auth/commom/auth.constant";
import jwtConfig from "src/auth/config/jwt-config";

export class AuthMiddleware implements NestMiddleware {
	constructor(
		private readonly jwtService: JwtService,

		@Inject(jwtConfig.KEY)
		private jwtConfiguration: ConfigType<typeof jwtConfig>,
	) {}

	async use(req: Request, res: Response, next: (error?: any) => void) {
		// console.log(req.path);
		if (req.path === "/auth" || req.path === "/priorities" || req.path === "/status") return next();

		const token = this.extractToken(req);

		if (!token) throw new HttpException("Token not found.", HttpStatus.UNAUTHORIZED);

		try {
			const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration);
			req[TOKEN_PAYLOAD] = payload;
			next();
		} catch (error) {
			throw new HttpException("Invalid or expired token.", HttpStatus.UNAUTHORIZED);
		}
	}

	extractToken(request: Request) {
		const auth = request.headers.authorization;

		if (!auth || typeof auth !== "string") return;

		return auth.split(" ")[1];
	}
}
