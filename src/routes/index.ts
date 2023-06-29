import { Router } from "express";

import { usersRoutes } from "./users.routes";
import { adminRoutes } from "./admin.routes";

export const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/admin", adminRoutes);
// routes.use("/recipes");
// routes.use("/sessions");
