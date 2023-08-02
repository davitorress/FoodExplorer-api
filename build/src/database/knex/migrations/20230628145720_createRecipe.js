"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    if (await knex.schema.hasTable("recipes")) {
        return;
    }
    return knex.schema.createTable("recipes", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.double("price").notNullable();
        table.string("description").notNullable();
        table.integer("category_id").references("id").inTable("categories").notNullable();
        table.string("image").nullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTableIfExists("recipes");
}
exports.down = down;
