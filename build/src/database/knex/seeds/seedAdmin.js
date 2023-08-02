"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
const bcryptjs_1 = require("bcryptjs");
async function seed(knex) {
    const name = "admin";
    const email = "admin@email.com";
    const password = "123456";
    const hashedPassword = await (0, bcryptjs_1.hash)(password, 8);
    const admin = await knex("admin").where({ email }).first();
    if (!admin)
        await knex("admin").insert({ name, email, password: hashedPassword });
}
exports.seed = seed;
