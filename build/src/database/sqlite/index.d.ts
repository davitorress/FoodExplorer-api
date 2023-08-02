/// <reference types="./vendor-typings/sqlite3" />
import sqlite from "sqlite";
import sqlite3 from "sqlite3";
export declare function sqliteConnection(): Promise<sqlite.Database<sqlite3.Database, sqlite3.Statement>>;
