import { Router } from "express";

import { AdminController } from "../controllers/AdminController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const adminRoutes = Router();
const adminController = new AdminController();

adminRoutes.post("/", adminController.create);
adminRoutes.put("/", ensureAuthenticated, adminController.update);

export { adminRoutes };
