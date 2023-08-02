"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqliteConnection = void 0;
const path_1 = __importDefault(require("path"));
const sqlite_1 = __importDefault(require("sqlite"));
const sqlite3_1 = __importDefault(require("sqlite3"));
async function sqliteConnection() {
    const database = await sqlite_1.default.open({
        filename: path_1.default.resolve(__dirname, "..", "database.db"),
        driver: sqlite3_1.default.Database,
    });
    return database;
}
exports.sqliteConnection = sqliteConnection;
