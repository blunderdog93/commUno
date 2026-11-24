import { Router } from "express";
import {
  registerUserController,
  loginUserController,
} from "../controller/auth-controller.js";
import refreshTokenController from "../controller/refreshTokenController.js";
import emailVerificationController from "../controller/emailVerificationController.js";
const router = Router();

router.post("/register", registerUserController);
router.post("/verifyemail", emailVerificationController);
router.post("/login", loginUserController);
router.post("/refresh", refreshTokenController);

export default router;
