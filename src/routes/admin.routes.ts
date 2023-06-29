import { Router } from "express";

import { AdminController } from "../controllers/AdminController";

const adminRoutes = Router();
const adminController = new AdminController();

adminRoutes.post("/", adminController.create);
adminRoutes.put("/:id", adminController.update);

export { adminRoutes };
