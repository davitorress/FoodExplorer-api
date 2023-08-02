import { z } from "zod";
import { Request, Response } from "express";

import { knexCon } from "../database/knex";
import { AppError } from "../utils/AppError";

export class RecipeController {
	async index(req: Request, res: Response) {
		const { name, ingredients } = req.query;

		let recipes = await knexCon("recipes")
			.select([
				"recipes.id",
				"recipes.name",
				"recipes.description",
				"recipes.category_id",
				"recipes.price",
				"recipes.image",
			])
			.whereLike("recipes.name", `%${name}%`);

		if (ingredients) {
			const filterIngredients = ingredients
				.toString()
				.split(",")
				.map((ingredient) => ingredient.trim());

			const ingredientsFiltered = await knexCon("ingredients")
				.select("name")
				.whereLike("name", `%${filterIngredients}%`);

			if (recipes.length === 0) {
				recipes = await knexCon("recipes")
					.select([
						"recipes.id",
						"recipes.name",
						"recipes.description",
						"recipes.category_id",
						"recipes.price",
						"recipes.image",
					])
					.whereIn(
						"ingredients.name",
						ingredientsFiltered.map((ingredient) => ingredient.name)
					)
					.innerJoin("ingredients", "recipes.id", "ingredients.recipe_id");
			} else {
				if (ingredientsFiltered.length > 0) {
					recipes = await knexCon("recipes")
						.select([
							"recipes.id",
							"recipes.name",
							"recipes.description",
							"recipes.category_id",
							"recipes.price",
							"recipes.image",
						])
						.whereLike("recipes.name", `%${name}%`)
						.whereIn(
							"ingredients.name",
							ingredientsFiltered.map((ingredient) => ingredient.name)
						)
						.innerJoin("ingredients", "recipes.id", "ingredients.recipe_id");
				}
			}
		}

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

		const categories = await knexCon("categories").select("id", "name");
		const categoriesWithRecipes = await Promise.all(
			categories.map(async (category) => {
				const filteredRecipes = recipesWithIngredients.filter((recipe) => recipe.category_id === category.id);
				return {
					...category,
					recipes: filteredRecipes,
				};
			})
		);

		return res.json(categoriesWithRecipes);
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
			category_id: z.number().min(1).nonnegative({ message: "Selecione uma categoria!" }),
			price: z.number().nonnegative({ message: "O preço não pode ser negativo!" }),
			ingredients: z.array(z.string()).nonempty({ message: "Insira pelo menos um ingrediente!" }),
		});

		const admin = req.user!.admin;
		const result = bodySchema.safeParse(req.body);

		if (!result.success) {
			throw new AppError(result.error.issues[0].message);
		}
		const { name, description, category_id, price, ingredients } = result.data;

		if (!admin) throw new AppError("Você não tem permissão para criar receitas!", 401);

		const [recipe_id] = await knexCon("recipes").insert({
			name,
			description,
			category_id,
			price,
		});

		const ingredientsToInsert = ingredients.map((ingredient: string) => ({
			recipe_id,
			name: ingredient,
		}));
		await knexCon("ingredients").insert(ingredientsToInsert);

		return res.status(201).json({ id: recipe_id });
	}

	async update(req: Request, res: Response) {
		const bodySchema = z.object({
			name: z.string().nonempty({ message: "O nome não pode ser vazio!" }).optional(),
			description: z.string().nonempty({ message: "A descrição não pode ser vazia!" }).optional(),
			category_id: z.number().min(1).nonnegative({ message: "Selecione uma categoria!" }).optional(),
			price: z.number().nonnegative({ message: "O preço não pode ser negativo!" }).optional(),
			ingredients: z.array(z.string()).nonempty({ message: "Insira pelo menos um ingrediente!" }).optional(),
		});

		const admin = req.user!.admin;
		const result = bodySchema.safeParse(req.body);

		if (!result.success) {
			throw new AppError(result.error.issues[0].message);
		}
		const { name, description, category_id, price, ingredients } = result.data;
		const { id } = req.params;

		if (!admin) throw new AppError("Você não tem permissão para editar receitas!", 401);

		const recipe = await knexCon("recipes").where({ id }).first();

		if (!recipe) {
			throw new AppError("Receita não encontrada!");
		}

		recipe.name = name ?? recipe.name;
		recipe.description = description ?? recipe.description;
		recipe.category_id = category_id ?? recipe.category_id;
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

		const admin = req.user!.admin;
		if (!admin) throw new AppError("Você não tem permissão para deletar receitas!", 401);

		await knexCon("recipes").where({ id }).delete();
		return res.json();
	}
}
