import path from "path";
import sqlite from "sqlite";
import sqlite3 from "sqlite3";

export async function sqliteConnection() {
	const database = await sqlite.open({
		filename: path.resolve(__dirname, "..", "database.db"),
		driver: sqlite3.Database,
	});

	return database;
}
