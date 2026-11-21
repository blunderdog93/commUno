import {
  emailExists,
  usernameExists,
  createUser,
} from "../repository/userRepo.js";
import { createVerificationToken } from "../repository/tokenRepo.js";
import sendVerificationEmail from "./email-service.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

function generateVerificationToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  return { rawToken, tokenHash, expiresAt };
}

function isValidEmail(email) {
  if (typeof email !== "string" || !email) {
    return false;
  }
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return pattern.test(email);
}

function isStrongPassword(password) {
  if (typeof password !== "string") return false;

  // Minimum requirements for a strong password
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar
  );
}
function validateUser(email, password) {
  if (!isValidEmail(email)) {
    throw new Error("Not a valid email");
  }
  if (!isStrongPassword(password)) {
    throw new Error("Not a strong password");
  }
  return true;
}

async function hashPassword(password) {
  const hash = await bcrypt.hash(password, 12);
  return hash;
}

async function registerUser(username, email, password) {
  if (validateUser(email, password)) {
    if (await emailExists(email)) {
      throw new Error("Email already exists");
    }
    if (await usernameExists(username)) {
      throw new Error("Username already exists");
    }
  }
  const hash_password = await hashPassword(password);
  const user_id = (await createUser(username, email, hash_password)).id;
  const { rawToken, tokenHash, expiresAt } = generateVerificationToken();
  await createVerificationToken(user_id, tokenHash, expiresAt);
  const url = `http://localhost:5173/verifyemail?token=${rawToken}`;

  const data = await sendVerificationEmail(email, url);

  return { user_id, email, username };
}
export default registerUser;
