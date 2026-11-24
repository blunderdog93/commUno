import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import getCurrentUserController from "../controller/userController.js";

const router = Router();

router.get("/me", authMiddleware, getCurrentUserController);

export default router;
