import { Router } from "express";

export const routes = Router();

routes.use("/users");
routes.use("/recipes");
routes.use("/sessions");
