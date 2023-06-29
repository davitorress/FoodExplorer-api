import { jwtVerify } from "jose";
import { NextFunction, Request, Response } from "express";

import { authConfig, jwt_secret } from "../configs/auth";
import { AppError } from "../utils/AppError";

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization;

	if (!authHeader) throw new AppError("Token JWT não informado.", 401);

	const [, token] = authHeader.split(" ");
	console.log(token);
	try {
		const { payload } = await jwtVerify(token, jwt_secret, authConfig);
		req.user = {
			id: Number(payload.sub),
		};
		return next();
	} catch (error: any) {
		throw new AppError("Token JWT inválido.", 401);
	}
}
