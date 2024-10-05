import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post("/registro", authController.register);
authRoutes.post("/login", authController.login);

export default authRoutes;