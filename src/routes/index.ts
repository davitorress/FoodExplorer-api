import { Router } from "express";

import { usersRoutes } from "./users.routes";

export const routes = Router();

routes.use("/users", usersRoutes);
// routes.use("/recipes");
// routes.use("/sessions");
