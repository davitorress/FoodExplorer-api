import { Router } from "express";

import { UserController } from "../controllers/UserController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const usersRoutes = Router();
const userController = new UserController();

usersRoutes.post("/", userController.create);
usersRoutes.put("/:id", ensureAuthenticated, userController.update);

export { usersRoutes };
