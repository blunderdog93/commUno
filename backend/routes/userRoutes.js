import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import getUserController from "../controller/getUserController.js";
import updateUserController from "../controller/updateUserController.js";

const router = Router();

router.get("/me", authMiddleware, getUserController);
router.patch("/me", authMiddleware, updateUserController);

export default router;
