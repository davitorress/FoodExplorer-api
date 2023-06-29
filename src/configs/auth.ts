import { JWTVerifyOptions, JWTHeaderParameters } from "jose";

const authConfig: JWTVerifyOptions = {
	typ: "JWT",
	maxTokenAge: "1d",
	algorithms: ["HS256"],
	issuer: ["FoodExplorer"],
};

const headerConfig: JWTHeaderParameters = {
	alg: "HS256",
	typ: "JWT",
};

const jwt_secret = new TextEncoder().encode(process.env.JWT_SECRET || "default");

export { authConfig, headerConfig, jwt_secret };
