import { Request, Response } from "express";

import { knexCon } from "../database/knex";
import { AppError } from "../utils/AppError";
import { DiskStorage } from "../providers/DiskStorage";

export class RecipeImageController {
	async update(req: Request, res: Response) {
		const { id } = req.params;
		const admin = req.user!.admin;
		const imageFilename = req.file?.filename;

		if (!admin) throw new AppError("Você não tem permissão para editar receitas!", 401);
		if (!imageFilename) throw new AppError("Envie uma imagem para a receita!");

		const diskStorage = new DiskStorage();

		const recipe = await knexCon("recipes").where({ id }).first();

		if (!recipe) throw new AppError("Receita não encontrada!");

		if (recipe.image) await diskStorage.deleteFile(recipe.image);

		const filename = await diskStorage.saveFile(imageFilename);
		recipe.image = filename;

		await knexCon("recipes").where({ id }).update(recipe);

		return res.json(recipe);
	}
}
