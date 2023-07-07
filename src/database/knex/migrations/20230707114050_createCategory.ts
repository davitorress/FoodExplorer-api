import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	if (await knex.schema.hasTable("categories")) return;

	return knex.schema.createTable("categories", (table) => {
		table.increments("id").primary();
		table.string("name").notNullable();

		table.timestamp("created_at").defaultTo(knex.fn.now());
		table.timestamp("updated_at").defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists("categories");
}

