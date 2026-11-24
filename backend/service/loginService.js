import { loginUser } from "../repository/userRepo.js";
import { storeRefreshToken } from "../repository/tokenRepo.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

async function loginService(identifier, password) {
  const user = await loginUser(identifier);

  if (!user) {
    throw new Error("Invalid login credentials");
  }

  const { id, hashed_password, is_email_verified } = user;

  if (!id) {
    throw new Error("Invalid login credentials");
  }
  const isValid = await bcrypt.compare(password, hashed_password);

  if (!is_email_verified) {
    throw new Error("Email not verified");
  } else if (!isValid) {
    throw new Error("Invalid login credentials !");
  }
  const accessToken = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { userId: id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );

  const hashToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await storeRefreshToken(id, hashToken, expiresAt);

  return { accessToken, refreshToken };
}

export default loginService;
