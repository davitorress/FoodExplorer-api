import multer from "multer";
import { Router } from "express";

import { MULTER } from "../configs/upload";
import { RecipeController } from "../controllers/RecipeController";
import { RecipeImageController } from "../controllers/RecipeImageController";

const recipesRoutes = Router();
const upload = multer(MULTER);

const recipeController = new RecipeController();
const recipeImageController = new RecipeImageController();

recipesRoutes.get("/", recipeController.index);
recipesRoutes.get("/:id", recipeController.show);
recipesRoutes.post("/", recipeController.create);
recipesRoutes.patch("/:id", recipeController.update);
recipesRoutes.delete("/:id", recipeController.delete);
recipesRoutes.patch("/:id/image", upload.single("image"), recipeImageController.update);

export { recipesRoutes };
