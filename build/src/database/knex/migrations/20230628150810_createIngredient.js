"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    if (await knex.schema.hasTable("ingredients")) {
        return;
    }
    return knex.schema.createTable("ingredients", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.integer("recipe_id").references("id").inTable("recipes").onDelete("CASCADE");
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTableIfExists("ingredients");
}
exports.down = down;
