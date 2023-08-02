"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = void 0;
const jose_1 = require("jose");
const auth_1 = require("../configs/auth");
const AppError_1 = require("../utils/AppError");
async function ensureAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        throw new AppError_1.AppError("Token JWT não informado.", 401);
    const [, token] = authHeader.split(" ");
    try {
        const { payload } = await (0, jose_1.jwtVerify)(token, auth_1.jwt_secret, auth_1.authConfig);
        const data = JSON.parse(payload.sub);
        req.user = {
            id: Number(data.id),
            admin: data.admin,
        };
        return next();
    }
    catch (error) {
        throw new AppError_1.AppError("Token JWT inválido.", 401);
    }
}
exports.ensureAuthenticated = ensureAuthenticated;
