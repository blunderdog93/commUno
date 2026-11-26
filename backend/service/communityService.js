import {
  createCommunity,
  communityNameExists,
} from "../repository/communityRepo.js";

function createSlug(name) {
  if (typeof name !== "string" || !name.trim() || name.trim().length > 50) {
    const error = new Error("Invalid community name");
    error.statusCode = 400;
    throw error;
  }
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function createCommunityService(userId, communityData) {
  const { name, description, avatar_url } = communityData;
  if (
    description !== undefined &&
    description !== null &&
    (typeof description !== "string" || description.length > 500)
  ) {
    const error = new Error("Description must not exceed 500 characters");
    error.statusCode = 400;
    throw error;
  }
  if (await communityNameExists(name)) {
    throw new Error("Community name already exists");
  }

  const slug = createSlug(name);

  return await createCommunity(userId, name, slug, description, avatar_url);
}
export default createCommunityService;
