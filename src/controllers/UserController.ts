import { z } from "zod";
import { hash, compare } from "bcryptjs";
import { Request, Response } from "express";

import { knexCon } from "../database/knex";
import { AppError } from "../utils/AppError";

export class UserController {
	async create(req: Request, res: Response) {
		const bodySchema = z.object({
			name: z.string(),
			email: z.string().email({ message: "E-mail inválido!" }),
			password: z
				.string()
				.min(6, { message: "A senha deve ter no mínimo 6 caracteres!" })
				.max(20, { message: "A senha deve ter no máximo 20 caracteres!" }),
		});
		const result = bodySchema.safeParse(req.body);

		if (!result.success) {
			throw new AppError(result.error.issues[0].message);
		}
		const { name, email, password } = result.data;

		const checkUserExists = await knexCon("users").where({ email }).first();

		if (checkUserExists) {
			throw new AppError("Este e-mail já está em uso.");
		}

		const hashedPassword = await hash(password, 8);
		await knexCon("users").insert({ name, email, password: hashedPassword });

		return res.status(201).json();
	}
}