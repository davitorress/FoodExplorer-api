import { z } from "zod";
import { hash, compare } from "bcryptjs";
import { Request, Response } from "express";

import { knexCon } from "../database/knex";
import { AppError } from "../utils/AppError";

export class AdminController {
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

		const checkUserExists = await knexCon("admin").where({ email }).first();

		if (checkUserExists) {
			throw new AppError("Este e-mail já está em uso.");
		}

		const hashedPassword = await hash(password, 8);
		await knexCon("admin").insert({ name, email, password: hashedPassword });

		return res.status(201).json();
	}

	async update(req: Request, res: Response) {
		const bodySchema = z.object({
			name: z.string(),
			email: z.string().email({ message: "E-mail inválido!" }),
			password: z
				.string()
				.min(6, { message: "A senha deve ter no mínimo 6 caracteres!" })
				.max(20, { message: "A senha deve ter no máximo 20 caracteres!" })
				.optional(),
			old_password: z
				.string()
				.min(6, { message: "A senha deve ter no mínimo 6 caracteres!" })
				.max(20, { message: "A senha deve ter no máximo 20 caracteres!" })
				.optional(),
		});

		const id = req.user!.id;
		const admin = req.user!.admin;
		const result = bodySchema.safeParse(req.body);

		if (!result.success) {
			throw new AppError(result.error.issues[0].message);
		}
		const { name, email, password, old_password } = result.data;

		if (!admin) throw new AppError("Você não pode alterar dados de um administrador!", 401);

		const user = await knexCon("admin").where({ id }).first();
		if (!user) {
			throw new AppError("Usuário não encontrado.");
		}

		const userWithUpdatedEmail = await knexCon("admin").where({ email }).first();
		if (userWithUpdatedEmail && userWithUpdatedEmail.id !== Number(id)) {
			throw new AppError("Este e-mail já está em uso.");
		}

		user.name = name ?? user.name;
		user.email = email ?? user.email;

		if (password && !old_password) {
			throw new AppError("A senha antiga deve ser informada.");
		}

		if (password && old_password) {
			const checkOldPassword = await compare(old_password, user.password);
			if (!checkOldPassword) {
				throw new AppError("A senha antiga não confere.");
			}
			user.password = await hash(password, 8);
		}

		await knexCon("admin").where({ id }).update(user);
		return res.json(user);
	}
}
