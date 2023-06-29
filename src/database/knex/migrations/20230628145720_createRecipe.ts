import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	if (await knex.schema.hasTable("recipes")) {
		return;
	}

	return knex.schema.createTable("recipes", (table) => {
		table.increments("id").primary();
		table.string("name").notNullable();
		table.double("price").notNullable();
		table.string("category").notNullable();
		table.string("description").notNullable();

		table.string("image").nullable();
		table.timestamp("created_at").defaultTo(knex.fn.now());
		table.timestamp("updated_at").defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists("recipes");
}

