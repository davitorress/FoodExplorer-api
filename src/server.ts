import "express-async-errors";

import cors from "cors";
import express from "express";
import { Errback, Request, Response, NextFunction } from "express";

import { routes } from "./routes";
import { AppError } from "./utils/AppError";
import { UPLOAD_FOLDER } from "./configs/upload";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/files", express.static(UPLOAD_FOLDER));

app.use(routes);
app.use((error: Errback, req: Request, res: Response, next: NextFunction) => {
	if (error instanceof AppError) {
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
