import path from "path";
import { Knex } from "knex";

const knexConfig = {
	development: {
		client: "sqlite3",
		connection: {
			filename: path.resolve(__dirname, "src", "database", "database.db"),
		},
		pool: {
			afterCreate: (con: any, cb: Function) => con.run("PRAGMA foreign_keys = ON", cb),
		},
		migrations: {
			directory: path.resolve(__dirname, "src", "database", "knex", "migrations"),
		},
		useNullAsDefault: true,
	} as Knex.Config,
};

export default knexConfig;
