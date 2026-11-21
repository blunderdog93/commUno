import registerUser from "../service/authService.js";

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

export default registerUserController;
