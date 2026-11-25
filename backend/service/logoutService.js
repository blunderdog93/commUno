import { revokeToken } from "../repository/tokenRepo.js";
import crypto from "crypto";

async function revokeTokenService(refreshToken) {
  try {
    const hashToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await revokeToken(refreshToken);
  } catch (error) {
    throw new Error("Unable to logout");
  }
}

export default revokeTokenService;
