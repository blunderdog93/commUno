import { updateUserService } from "../service/userService.js";

async function updateUserController(req, res) {
  try {
    const userId = req.user.userId;
    const updateData = req.body;

    const user = await updateUserService(userId, updateData);

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    if (
      error.message === "No new value to update" ||
      error.message === "Invalid bio" ||
      error.message === "Invalid username" ||
      error.message === "Invalid avatar URL"
    ) {
      return res.status(400).json({ message: error.message });
    }

    if (error.message === "No such user exists") {
      return res.status(404).json({ message: error.message });
    }

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export default updateUserController;
