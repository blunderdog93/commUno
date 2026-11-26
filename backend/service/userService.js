import {
  getUser,
  updateUser,
  getPublicUser,
} from "../repository/userActionRepo.js";

async function getUserService(userId) {
  const user = await getUser(userId);
  if (!user) {
    throw new Error("No such user exists");
  }
  return user;
}

async function updateUserService(userId, updateData) {
  const bioProvided = Object.hasOwn(updateData, "bio");
  const usernameProvided = Object.hasOwn(updateData, "username");
  const avatarUrlProvided = Object.hasOwn(updateData, "avatar_url");

  if (!bioProvided && !usernameProvided && !avatarUrlProvided) {
    throw new Error("No new value to update");
  }

  let newBio = null;
  let newUsername = null;
  let newAvatarUrl = null;

  if (bioProvided) {
    if (updateData.bio !== null && typeof updateData.bio !== "string") {
      throw new Error("Invalid bio");
    }
    newBio = updateData.bio;
  }

  if (usernameProvided) {
    if (
      typeof updateData.username !== "string" ||
      !updateData.username.trim()
    ) {
      throw new Error("Invalid username");
    }
    newUsername = updateData.username.trim();
  }

  if (avatarUrlProvided) {
    if (
      updateData.avatar_url !== null &&
      typeof updateData.avatar_url !== "string"
    ) {
      throw new Error("Invalid avatar URL");
    }
    newAvatarUrl = updateData.avatar_url;
  }

  const user = await updateUser(
    bioProvided,
    newBio,
    usernameProvided,
    newUsername,
    avatarUrlProvided,
    newAvatarUrl,
    userId,
  );

  if (!user) {
    throw new Error("No such user exists");
  }

  return user;
}

async function getPublicUserService(userId) {
  const parsedUserId = Number(userId);

  if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
    throw new Error("Invalid user ID");
  }

  const user = await getPublicUser(parsedUserId);

  if (!user) {
    throw new Error("No such user exists");
  }

  return user;
}
export { getUserService, updateUserService, getPublicUserService };
