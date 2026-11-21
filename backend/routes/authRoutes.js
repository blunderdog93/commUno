import { Router } from "express";
import registerUserController from "../controller/auth-controller.js";
import emailVerificationController from "../controller/emailVerificationController.js";
const router = Router();

router.post("/register", registerUserController);
router.post("/verifyemail", emailVerificationController);

export default router;
