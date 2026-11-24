import rotateRefreshToken from "../service/refreshTokenService.js";

async function refreshTokenController(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { newRefreshToken, newAccessToken } =
      await rotateRefreshToken(refreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Tokens refreshed successfully",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}

export default refreshTokenController;
