import { JWTVerifyOptions, JWTHeaderParameters } from "jose";
declare const authConfig: JWTVerifyOptions;
declare const headerConfig: JWTHeaderParameters;
declare const jwt_secret: Uint8Array;
export { authConfig, headerConfig, jwt_secret };
