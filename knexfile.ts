const path = require("path");
import { Knex } from "knex";

const knexConfig: { development: Knex.Config } = {
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
		seeds: {
			directory: path.resolve(__dirname, "src", "database", "knex", "seeds"),
		},
		useNullAsDefault: true,
	},
};

export default knexConfig;
