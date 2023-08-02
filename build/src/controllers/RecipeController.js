"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeController = void 0;
const zod_1 = require("zod");
const knex_1 = require("../database/knex");
const AppError_1 = require("../utils/AppError");
class RecipeController {
    async index(req, res) {
        const { name, ingredients } = req.query;
        let recipes = await (0, knex_1.knexCon)("recipes")
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
            const ingredientsFiltered = await (0, knex_1.knexCon)("ingredients")
                .select("name")
                .whereLike("name", `%${filterIngredients}%`);
            if (recipes.length === 0) {
                recipes = await (0, knex_1.knexCon)("recipes")
                    .select([
                    "recipes.id",
                    "recipes.name",
                    "recipes.description",
                    "recipes.category_id",
                    "recipes.price",
                    "recipes.image",
                ])
                    .whereIn("ingredients.name", ingredientsFiltered.map((ingredient) => ingredient.name))
                    .innerJoin("ingredients", "recipes.id", "ingredients.recipe_id");
            }
            else {
                if (ingredientsFiltered.length > 0) {
                    recipes = await (0, knex_1.knexCon)("recipes")
                        .select([
                        "recipes.id",
                        "recipes.name",
                        "recipes.description",
                        "recipes.category_id",
                        "recipes.price",
                        "recipes.image",
                    ])
                        .whereLike("recipes.name", `%${name}%`)
                        .whereIn("ingredients.name", ingredientsFiltered.map((ingredient) => ingredient.name))
                        .innerJoin("ingredients", "recipes.id", "ingredients.recipe_id");
                }
            }
        }
        const recipesWithIngredients = await Promise.all(recipes.map(async (recipe) => {
            const ingredients = await (0, knex_1.knexCon)("ingredients").where({ recipe_id: recipe.id }).select("name");
            const recipeWithIngredients = {
                ...recipe,
                ingredients: ingredients.map((ingredient) => ingredient.name),
            };
            return recipeWithIngredients;
        }));
        const categories = await (0, knex_1.knexCon)("categories").select("id", "name");
        const categoriesWithRecipes = await Promise.all(categories.map(async (category) => {
            const filteredRecipes = recipesWithIngredients.filter((recipe) => recipe.category_id === category.id);
            return {
                ...category,
                recipes: filteredRecipes,
            };
        }));
        return res.json(categoriesWithRecipes);
    }
    async show(req, res) {
        const { id } = req.params;
        const recipe = await (0, knex_1.knexCon)("recipes").where({ id }).first();
        if (!recipe) {
            throw new AppError_1.AppError("Receita não encontrada!");
        }
        const ingredients = await (0, knex_1.knexCon)("ingredients").where({ recipe_id: id }).select("name");
        const recipeWithIngredients = {
            ...recipe,
            ingredients: ingredients.map((ingredient) => ingredient.name),
        };
        return res.json(recipeWithIngredients);
    }
    async create(req, res) {
        const bodySchema = zod_1.z.object({
            name: zod_1.z.string().nonempty({ message: "O nome não pode ser vazio!" }),
            description: zod_1.z.string().nonempty({ message: "A descrição não pode ser vazia!" }),
            category_id: zod_1.z.number().min(1).nonnegative({ message: "Selecione uma categoria!" }),
            price: zod_1.z.number().nonnegative({ message: "O preço não pode ser negativo!" }),
            ingredients: zod_1.z.array(zod_1.z.string()).nonempty({ message: "Insira pelo menos um ingrediente!" }),
        });
        const admin = req.user.admin;
        const result = bodySchema.safeParse(req.body);
        if (!result.success) {
            throw new AppError_1.AppError(result.error.issues[0].message);
        }
        const { name, description, category_id, price, ingredients } = result.data;
        if (!admin)
            throw new AppError_1.AppError("Você não tem permissão para criar receitas!", 401);
        const [recipe_id] = await (0, knex_1.knexCon)("recipes").insert({
            name,
            description,
            category_id,
            price,
        });
        const ingredientsToInsert = ingredients.map((ingredient) => ({
            recipe_id,
            name: ingredient,
        }));
        await (0, knex_1.knexCon)("ingredients").insert(ingredientsToInsert);
        return res.status(201).json({ id: recipe_id });
    }
    async update(req, res) {
        const bodySchema = zod_1.z.object({
            name: zod_1.z.string().nonempty({ message: "O nome não pode ser vazio!" }).optional(),
            description: zod_1.z.string().nonempty({ message: "A descrição não pode ser vazia!" }).optional(),
            category_id: zod_1.z.number().min(1).nonnegative({ message: "Selecione uma categoria!" }).optional(),
            price: zod_1.z.number().nonnegative({ message: "O preço não pode ser negativo!" }).optional(),
            ingredients: zod_1.z.array(zod_1.z.string()).nonempty({ message: "Insira pelo menos um ingrediente!" }).optional(),
        });
        const admin = req.user.admin;
        const result = bodySchema.safeParse(req.body);
        if (!result.success) {
            throw new AppError_1.AppError(result.error.issues[0].message);
        }
        const { name, description, category_id, price, ingredients } = result.data;
        const { id } = req.params;
        if (!admin)
            throw new AppError_1.AppError("Você não tem permissão para editar receitas!", 401);
        const recipe = await (0, knex_1.knexCon)("recipes").where({ id }).first();
        if (!recipe) {
            throw new AppError_1.AppError("Receita não encontrada!");
        }
        recipe.name = name ?? recipe.name;
        recipe.description = description ?? recipe.description;
        recipe.category_id = category_id ?? recipe.category_id;
        recipe.price = price ?? recipe.price;
        if (ingredients) {
            await (0, knex_1.knexCon)("ingredients").where({ recipe_id: id }).delete();
            const ingredientsToInsert = ingredients.map((ingredient) => ({
                recipe_id: id,
                name: ingredient,
            }));
            await (0, knex_1.knexCon)("ingredients").insert(ingredientsToInsert);
        }
        await (0, knex_1.knexCon)("recipes").where({ id }).update(recipe);
        const ingredientsToReturn = await (0, knex_1.knexCon)("ingredients").where({ recipe_id: id });
        return res.json({
            ...recipe,
            ingredients: ingredients ?? ingredientsToReturn.map((ingredient) => ingredient.name),
        });
    }
    async delete(req, res) {
        const { id } = req.params;
        const admin = req.user.admin;
        if (!admin)
            throw new AppError_1.AppError("Você não tem permissão para deletar receitas!", 401);
        await (0, knex_1.knexCon)("recipes").where({ id }).delete();
        return res.json();
    }
}
exports.RecipeController = RecipeController;
