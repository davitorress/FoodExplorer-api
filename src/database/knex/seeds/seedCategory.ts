import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
	const hasCategories = await knex("categories").select("name");
	if (hasCategories.length <= 0) {
		await knex("categories").insert([{ name: "Refeições" }, { name: "Acompanhamentos" }, { name: "Bebidas" }]);
	}
}

