import { Router } from "express";

import { usersRoutes } from "./users.routes";
import { adminRoutes } from "./admin.routes";
import { recipesRoutes } from "./recipes.routes";
import { sessionRoutes } from "./session.routes";

export const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/admin", adminRoutes);
routes.use("/recipes", recipesRoutes);
routes.use("/sessions", sessionRoutes);
