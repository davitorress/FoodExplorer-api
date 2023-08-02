"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const zod_1 = require("zod");
const bcryptjs_1 = require("bcryptjs");
const jose_1 = require("jose");
const knex_1 = require("../database/knex");
const AppError_1 = require("../utils/AppError");
const auth_1 = require("../configs/auth");
class SessionController {
    async create(req, res) {
        const bodySchema = zod_1.z.object({
            email: zod_1.z.string().email({ message: "E-mail inválido!" }).nonempty({ message: "O e-mail não pode ser vazio!" }),
            password: zod_1.z
                .string()
                .min(6, { message: "A senha deve ter no mínimo 6 caracteres!" })
                .max(20, { message: "A senha deve ter no máximo 20 caracteres!" })
                .nonempty({ message: "Senha não informada!" }),
            admin: zod_1.z.boolean().optional(),
        });
        const result = bodySchema.safeParse(req.body);
        if (!result.success)
            throw new AppError_1.AppError(result.error.issues[0].message);
        const { email, password, admin } = result.data;
        let user = await (0, knex_1.knexCon)("users").where({ email }).first();
        if (admin) {
            user = await (0, knex_1.knexCon)("admin").where({ email }).first();
            user.admin = true;
        }
        if (!user)
            throw new AppError_1.AppError("E-mail ou senha incorretos.", 401);
        const passwordMatch = await (0, bcryptjs_1.compare)(password, user.password);
        if (!passwordMatch)
            throw new AppError_1.AppError("E-mail ou senha incorretos.", 401);
        const payload = {
            sub: JSON.stringify({
                id: user.id,
                admin: admin ?? false,
            }),
        };
        const signJWT = new jose_1.SignJWT(payload);
        signJWT
            .setIssuedAt()
            .setProtectedHeader(auth_1.headerConfig)
            .setIssuer(auth_1.authConfig.issuer[0])
            .setExpirationTime(auth_1.authConfig.maxTokenAge.toString());
        const token = await signJWT.sign(auth_1.jwt_secret);
        return res.status(201).json({ user, token });
    }
}
exports.SessionController = SessionController;
