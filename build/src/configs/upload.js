"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOAD_FOLDER = exports.TMP_FOLDER = exports.MULTER = void 0;
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const crypto_1 = __importDefault(require("crypto"));
const TMP_FOLDER = path_1.default.resolve(__dirname, "..", "..", "tmp");
exports.TMP_FOLDER = TMP_FOLDER;
const UPLOAD_FOLDER = path_1.default.resolve(__dirname, "..", "..", "uploads");
exports.UPLOAD_FOLDER = UPLOAD_FOLDER;
const MULTER = {
    storage: multer_1.default.diskStorage({
        destination: TMP_FOLDER,
        filename(req, file, cb) {
            const fileHash = crypto_1.default.randomBytes(16).toString("hex");
            const fileName = `${fileHash}-${file.originalname}`;
            return cb(null, fileName);
        },
    }),
};
exports.MULTER = MULTER;
