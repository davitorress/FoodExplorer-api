"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const zod_1 = require("zod");
const bcryptjs_1 = require("bcryptjs");
const knex_1 = require("../database/knex");
const AppError_1 = require("../utils/AppError");
class AdminController {
    async create(req, res) {
        const bodySchema = zod_1.z.object({
            name: zod_1.z.string(),
            email: zod_1.z.string().email({ message: "E-mail inválido!" }),
            password: zod_1.z
                .string()
                .min(6, { message: "A senha deve ter no mínimo 6 caracteres!" })
                .max(20, { message: "A senha deve ter no máximo 20 caracteres!" }),
        });
        const result = bodySchema.safeParse(req.body);
        if (!result.success) {
            throw new AppError_1.AppError(result.error.issues[0].message);
        }
        const { name, email, password } = result.data;
        const checkUserExists = await (0, knex_1.knexCon)("admin").where({ email }).first();
        if (checkUserExists) {
            throw new AppError_1.AppError("Este e-mail já está em uso.");
        }
        const hashedPassword = await (0, bcryptjs_1.hash)(password, 8);
        await (0, knex_1.knexCon)("admin").insert({ name, email, password: hashedPassword });
        return res.status(201).json();
    }
    async update(req, res) {
        const bodySchema = zod_1.z.object({
            name: zod_1.z.string(),
            email: zod_1.z.string().email({ message: "E-mail inválido!" }),
            password: zod_1.z
                .string()
                .min(6, { message: "A senha deve ter no mínimo 6 caracteres!" })
                .max(20, { message: "A senha deve ter no máximo 20 caracteres!" })
                .optional(),
            old_password: zod_1.z
                .string()
                .min(6, { message: "A senha deve ter no mínimo 6 caracteres!" })
                .max(20, { message: "A senha deve ter no máximo 20 caracteres!" })
                .optional(),
        });
        const id = req.user.id;
        const admin = req.user.admin;
        const result = bodySchema.safeParse(req.body);
        if (!result.success) {
            throw new AppError_1.AppError(result.error.issues[0].message);
        }
        const { name, email, password, old_password } = result.data;
        if (!admin)
            throw new AppError_1.AppError("Você não pode alterar dados de um administrador!", 401);
        const user = await (0, knex_1.knexCon)("admin").where({ id }).first();
        if (!user) {
            throw new AppError_1.AppError("Usuário não encontrado.");
        }
        const userWithUpdatedEmail = await (0, knex_1.knexCon)("admin").where({ email }).first();
        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== Number(id)) {
            throw new AppError_1.AppError("Este e-mail já está em uso.");
        }
        user.name = name ?? user.name;
        user.email = email ?? user.email;
        if (password && !old_password) {
            throw new AppError_1.AppError("A senha antiga deve ser informada.");
        }
        if (password && old_password) {
            const checkOldPassword = await (0, bcryptjs_1.compare)(old_password, user.password);
            if (!checkOldPassword) {
                throw new AppError_1.AppError("A senha antiga não confere.");
            }
            user.password = await (0, bcryptjs_1.hash)(password, 8);
        }
        await (0, knex_1.knexCon)("admin").where({ id }).update(user);
        return res.json(user);
    }
}
exports.AdminController = AdminController;
