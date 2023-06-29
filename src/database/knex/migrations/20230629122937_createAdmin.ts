import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	if (await knex.schema.hasTable("admin")) return;

	return knex.schema.createTable("admin", (table) => {
		table.increments("id").primary();
		table.string("name").notNullable();
		table.string("password").notNullable();
		table.string("email").unique().notNullable();
		table.timestamp("created_at").defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists("admin");
}

