"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeImageController = void 0;
const knex_1 = require("../database/knex");
const AppError_1 = require("../utils/AppError");
const DiskStorage_1 = require("../providers/DiskStorage");
class RecipeImageController {
    async update(req, res) {
        const { id } = req.params;
        const admin = req.user.admin;
        const imageFilename = req.file?.filename;
        if (!admin)
            throw new AppError_1.AppError("Você não tem permissão para editar receitas!", 401);
        if (!imageFilename)
            throw new AppError_1.AppError("Envie uma imagem para a receita!");
        const diskStorage = new DiskStorage_1.DiskStorage();
        const recipe = await (0, knex_1.knexCon)("recipes").where({ id }).first();
        if (!recipe)
            throw new AppError_1.AppError("Receita não encontrada!");
        if (recipe.image)
            await diskStorage.deleteFile(recipe.image);
        const filename = await diskStorage.saveFile(imageFilename);
        recipe.image = filename;
        await (0, knex_1.knexCon)("recipes").where({ id }).update(recipe);
        return res.json(recipe);
    }
}
exports.RecipeImageController = RecipeImageController;
