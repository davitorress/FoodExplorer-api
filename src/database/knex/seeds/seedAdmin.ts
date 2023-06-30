import { Knex } from "knex";
import { hash } from "bcryptjs";

export async function seed(knex: Knex): Promise<void> {
	const name = "admin";
	const email = "admin@email.com";
	const password = "123456";
	const hashedPassword = await hash(password, 8);

	const admin = await knex("admin").where({ email }).first();
	if (!admin) await knex("admin").insert({ name, email, password: hashedPassword });
}

