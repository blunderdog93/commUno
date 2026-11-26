import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import getUserController from "../controller/getUserController.js";
import updateUserController from "../controller/updateUserController.js";
import getPublicUserController from "../controller/userController.js";

const router = Router();

router.get("/me", authMiddleware, getUserController);
router.patch("/me", authMiddleware, updateUserController);
router.get("/:userId", getPublicUserController);
export default router;
