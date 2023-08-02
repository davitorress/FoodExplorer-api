"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwt_secret = exports.headerConfig = exports.authConfig = void 0;
const authConfig = {
    typ: "JWT",
    maxTokenAge: "1d",
    algorithms: ["HS256"],
    issuer: ["FoodExplorer"],
};
exports.authConfig = authConfig;
const headerConfig = {
    alg: "HS256",
    typ: "JWT",
};
exports.headerConfig = headerConfig;
const jwt_secret = new TextEncoder().encode(process.env.JWT_SECRET || "default");
exports.jwt_secret = jwt_secret;
