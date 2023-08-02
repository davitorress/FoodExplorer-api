"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    if (await knex.schema.hasTable("users")) {
        return;
    }
    return knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("password").notNullable();
        table.string("email").unique().notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTableIfExists("users");
}
exports.down = down;
