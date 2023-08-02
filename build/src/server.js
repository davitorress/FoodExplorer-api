"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const AppError_1 = require("./utils/AppError");
const upload_1 = require("./configs/upload");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/files", express_1.default.static(upload_1.UPLOAD_FOLDER));
app.use(routes_1.routes);
app.use((error, req, res, next) => {
    if (error instanceof AppError_1.AppError) {
        return res.status(error.statusCode).json({
            status: "error",
            message: error.message,
        });
    }
    return res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
});
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
