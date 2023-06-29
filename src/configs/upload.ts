import path from "path";
import multer, { Options } from "multer";
import crypto from "crypto";

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
const UPLOAD_FOLDER = path.resolve(__dirname, "..", "..", "uploads");

const MULTER: Options = {
	storage: multer.diskStorage({
		destination: TMP_FOLDER,
		filename(req, file, cb) {
			const fileHash = crypto.randomBytes(16).toString("hex");
			const fileName = `${fileHash}-${file.originalname}`;

			return cb(null, fileName);
		},
	}),
};

export { MULTER, TMP_FOLDER, UPLOAD_FOLDER };
