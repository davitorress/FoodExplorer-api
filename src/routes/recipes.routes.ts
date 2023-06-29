import { Router } from "express";

import { RecipeController } from "../controllers/RecipeController";

const recipesRoutes = Router();
const recipeController = new RecipeController();

recipesRoutes.get("/", recipeController.index);
recipesRoutes.get("/:id", recipeController.show);
recipesRoutes.post("/", recipeController.create);
recipesRoutes.patch("/:id", recipeController.update);
recipesRoutes.delete("/:id", recipeController.delete);

export { recipesRoutes };
