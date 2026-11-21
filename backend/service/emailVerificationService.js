import { verifyUserEmail, returnId } from "../repository/tokenRepo.js";
import crypto from "crypto";

async function emailVerification(rawToken) {
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const userId = await returnId(tokenHash);
  if (!userId) {
    throw new Error("Invalid or expired token");
  }
  console.log("User ID:", userId);
  console.log("Token hash:", tokenHash);
  const result = await verifyUserEmail(userId, tokenHash);

  if (!result) {
    throw new Error("Invalid Token");
  } else {
    return result;
  }
}

export default emailVerification;
