import { updateRefreshToken } from "../repository/tokenRepo.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

async function rotateRefreshToken(refreshToken) {
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  const id = decoded.userId;

  const newRefreshToken = jwt.sign(
    { userId: id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );
  const hashToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const newHashToken = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  const newAccessToken = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const userId = await updateRefreshToken(hashToken, newHashToken);
  if (!userId) {
    throw new Error("Unauthorized");
  }

  return {
    newAccessToken: newAccessToken,
    newRefreshToken: newRefreshToken,
  };
}

export default rotateRefreshToken;
