"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
async function seed(knex) {
    const hasCategories = await knex("categories").select("name");
    if (hasCategories.length <= 0) {
        await knex("categories").insert([{ name: "Refeições" }, { name: "Acompanhamentos" }, { name: "Bebidas" }]);
    }
}
exports.seed = seed;
