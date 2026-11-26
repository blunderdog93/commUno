import con from "../config/db.js";

async function getUser(id) {
  const { rows } = await con.query(
    "SELECT id, username, email, is_email_verified, avatar_url, bio, created_at, updated_at FROM users WHERE id = $1",
    [id],
  );

  return rows[0] ?? null;
}

async function updateUser(
  bio_provided,
  newBio,
  username_provided,
  newUsername,
  avatar_url_provided,
  newAvatar_url,
  id,
) {
  const { rows } = await con.query(
    "UPDATE users SET bio = CASE WHEN $1::boolean THEN $2 ELSE bio END, username = CASE WHEN $3::boolean THEN $4 ELSE username END, avatar_url = CASE WHEN $5::boolean THEN $6 ELSE avatar_url END, updated_at = NOW() WHERE id = $7 RETURNING id, username, bio, avatar_url, updated_at;",
    [
      bio_provided,
      newBio,
      username_provided,
      newUsername,
      avatar_url_provided,
      newAvatar_url,
      id,
    ],
  );
  return rows[0] ?? null;
}

async function getPublicUser(userId) {
  const { rows } = await con.query(
    `SELECT id, username, avatar_url, bio, created_at
     FROM users
     WHERE id = $1`,
    [userId],
  );

  return rows[0] ?? null;
}

export { getUser, updateUser, getPublicUser };
