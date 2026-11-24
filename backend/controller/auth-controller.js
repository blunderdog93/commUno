import registerUser from "../service/authService.js";
import loginService from "../service/loginService.js";

async function registerUserController(req, res) {
  try {
    const { username, email, password } = req.body;
    const user = await registerUser(username, email, password);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error (register User)",
    });
  }
}

async function loginUserController(req, res) {
  try {
    const { identifier, password } = req.body;

    const { accessToken, refreshToken } = await loginService(
      identifier,
      password,
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error (login user)",
    });
  }
}

export { registerUserController, loginUserController };
