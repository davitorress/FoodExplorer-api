import { z } from "zod";
import { compare } from "bcryptjs";
import { SignJWT, JWTPayload } from "jose";
import { Request, Response } from "express";

import { knexCon } from "../database/knex";
import { AppError } from "../utils/AppError";
import { authConfig, headerConfig, jwt_secret } from "../configs/auth";

export class SessionController {
	async create(req: Request, res: Response) {
		const bodySchema = z.object({
			email: z.string().email({ message: "E-mail inválido!" }).nonempty({ message: "O e-mail não pode ser vazio!" }),
			password: z
				.string()
				.min(6, { message: "A senha deve ter no mínimo 6 caracteres!" })
				.max(20, { message: "A senha deve ter no máximo 20 caracteres!" })
				.nonempty({ message: "Senha não informada!" }),
			admin: z.boolean().optional(),
		});
		const result = bodySchema.safeParse(req.body);

		if (!result.success) throw new AppError(result.error.issues[0].message);
		const { email, password, admin } = result.data;

		let user = await knexCon("users").where({ email }).first();
		if (admin) user = await knexCon("admin").where({ email }).first();
		if (!user) throw new AppError("E-mail ou senha incorretos.", 401);

		const passwordMatch = await compare(password, user.password);
		if (!passwordMatch) throw new AppError("E-mail ou senha incorretos.", 401);

		const payload: JWTPayload = {
			sub: user.id,
		};
		const signJWT = new SignJWT(payload);
		signJWT
			.setIssuedAt()
			.setProtectedHeader(headerConfig)
			.setIssuer(authConfig.issuer![0])
			.setExpirationTime(authConfig.maxTokenAge!.toString());
		const token = await signJWT.sign(jwt_secret);

		return res.status(201).json({ user, token });
	}
}
