import express, { type Router } from "express";
import { AuthController } from "./login_controller";

const authController = new AuthController();
export const authRouter: Router = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
