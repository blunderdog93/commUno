import { getPublicUserService } from "../service/userService.js";

async function getPublicUserController(req, res) {
  try {
    const userId = req.params.userId;

    const user = await getPublicUserService(userId);

    return res.status(200).json({ user });
  } catch (error) {
    if (error.message === "Invalid user ID") {
      return res.status(400).json({ message: error.message });
    }

    if (error.message === "No such user exists") {
      return res.status(404).json({ message: error.message });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export default getPublicUserController;
