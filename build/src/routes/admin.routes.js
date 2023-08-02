"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const AdminController_1 = require("../controllers/AdminController");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const adminRoutes = (0, express_1.Router)();
exports.adminRoutes = adminRoutes;
const adminController = new AdminController_1.AdminController();
adminRoutes.post("/", adminController.create);
adminRoutes.put("/", ensureAuthenticated_1.ensureAuthenticated, adminController.update);
