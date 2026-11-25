import { getUserService } from "../service/userService.js";

async function getUserController(req, res) {
  try {
    const userId = req.user.userId;
    const user = await getUserService(userId);

    return res.status(200).json({
      user,
    });
  } catch (error) {
    if (error.message === "No such user exists") {
      return res.status(404).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
export default getUserController;
