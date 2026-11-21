import emailVerification from "../service/emailVerificationService.js";

async function emailVerificationController(req, res) {
  try {
    const { token } = req.body;
    console.log(token);
    const result = await emailVerification(token);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    if (error.message === "Invalid or expired token") {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export default emailVerificationController;
