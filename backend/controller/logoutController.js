import revokeTokenService from "../service/logoutService.js";

async function logoutController(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    await revokeTokenService(refreshToken);

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.status(200).json({
      message: "logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export default logoutController;
