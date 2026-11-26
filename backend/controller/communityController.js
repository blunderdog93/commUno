import createCommunityService from "../service/communityService.js";

async function createCommunityController(req, res) {
  try {
    const community = await createCommunityService(req.user.userId, req.body);

    return res.status(201).json({
      message: "Community created successfully",
      community,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }
    console.error("Create community error:", error);

    if (error.message === "Community name already exists") {
      return res.status(409).json({
        message: error.message,
      });
    }

    if (error.code === "23505") {
      return res.status(409).json({
        message: "A community with these details already exists",
      });
    }

    if (error.message === "Invalid community data") {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export default createCommunityController;
