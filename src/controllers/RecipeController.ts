import { z } from "zod";
import { Request, Response } from "express";

import { knexCon } from "../database/knex";
import { AppError } from "../utils/AppError";

export class RecipeController {
	async index(req: Request, res: Response) {
		const recipes = await knexCon("recipes").select([
			"recipes.id",
			"recipes.name",
			"recipes.description",
			"recipes.category",
			"recipes.price",
			"recipes.image",
		]);

		const recipesWithIngredients = await Promise.all(
			recipes.map(async (recipe) => {
				const ingredients = await knexCon("ingredients").where({ recipe_id: recipe.id }).select("name");
				const recipeWithIngredients = {
					...recipe,
					ingredients: ingredients.map((ingredient: { name: string }) => ingredient.name),
				};
				return recipeWithIngredients;
			})
		);

		return res.json(recipesWithIngredients);
	}

	async show(req: Request, res: Response) {
		const { id } = req.params;
		const recipe = await knexCon("recipes").where({ id }).first();

		if (!recipe) {
			throw new AppError("Receita não encontrada!");
		}

		const ingredients = await knexCon("ingredients").where({ recipe_id: id }).select("name");
		const recipeWithIngredients = {
			...recipe,
			ingredients: ingredients.map((ingredient: { name: string }) => ingredient.name),
		};

		return res.json(recipeWithIngredients);
	}

	async create(req: Request, res: Response) {
		const bodySchema = z.object({
			name: z.string().nonempty({ message: "O nome não pode ser vazio!" }),
			description: z.string().nonempty({ message: "A descrição não pode ser vazia!" }),
			category: z.string().nonempty({ message: "Selecione uma categoria!" }),
			price: z.number().nonnegative({ message: "O preço não pode ser negativo!" }),
			ingredients: z.array(z.string()).nonempty({ message: "Insira pelo menos um ingrediente!" }),
		});
		const result = bodySchema.safeParse(req.body);

		if (!result.success) {
			throw new AppError(result.error.issues[0].message);
		}
		const { name, description, category, price, ingredients } = result.data;

		const [recipe_id] = await knexCon("recipes").insert({
			name,
			description,
			category,
			price,
		});

		const ingredientsToInsert = ingredients.map((ingredient: string) => ({
			recipe_id,
			name: ingredient,
		}));
		await knexCon("ingredients").insert(ingredientsToInsert);

		return res.status(201).json();
	}

	async update(req: Request, res: Response) {
		const bodySchema = z.object({
			name: z.string().nonempty({ message: "O nome não pode ser vazio!" }).optional(),
			description: z.string().nonempty({ message: "A descrição não pode ser vazia!" }).optional(),
			category: z.string().nonempty({ message: "Selecione uma categoria!" }).optional(),
			price: z.number().nonnegative({ message: "O preço não pode ser negativo!" }).optional(),
			ingredients: z.array(z.string()).nonempty({ message: "Insira pelo menos um ingrediente!" }).optional(),
		});
		const result = bodySchema.safeParse(req.body);

		if (!result.success) {
			throw new AppError(result.error.issues[0].message);
		}
		const { name, description, category, price, ingredients } = result.data;
		const { id } = req.params;

		const recipe = await knexCon("recipes").where({ id }).first();

		if (!recipe) {
			throw new AppError("Receita não encontrada!");
		}

		recipe.name = name ?? recipe.name;
		recipe.description = description ?? recipe.description;
		recipe.category = category ?? recipe.category;
		recipe.price = price ?? recipe.price;

		if (ingredients) {
			await knexCon("ingredients").where({ recipe_id: id }).delete();

			const ingredientsToInsert = ingredients.map((ingredient: string) => ({
				recipe_id: id,
				name: ingredient,
			}));
			await knexCon("ingredients").insert(ingredientsToInsert);
		}

		await knexCon("recipes").where({ id }).update(recipe);
		const ingredientsToReturn = await knexCon("ingredients").where({ recipe_id: id });

		return res.json({
			...recipe,
			ingredients: ingredients ?? ingredientsToReturn.map((ingredient: any) => ingredient.name),
		});
	}

	async delete(req: Request, res: Response) {
		const { id } = req.params;
		await knexCon("recipes").where({ id }).delete();
		return res.json();
	}
}
