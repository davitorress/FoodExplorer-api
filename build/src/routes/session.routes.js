"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionRoutes = void 0;
const express_1 = require("express");
const SessionController_1 = require("../controllers/SessionController");
const sessionRoutes = (0, express_1.Router)();
exports.sessionRoutes = sessionRoutes;
const sessionController = new SessionController_1.SessionController();
sessionRoutes.post("/", sessionController.create);
