import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
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

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists("ingredients");
}

