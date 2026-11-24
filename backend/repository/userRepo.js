import con from "../config/db.js";

async function emailExists(email) {
  const { rows } = await con.query(
    "SELECT EXISTS (SELECT 1 FROM users WHERE email = $1) AS exists",
    [email],
  );
  return rows[0].exists;
}

async function usernameExists(username) {
  const { rows } = await con.query(
    "SELECT EXISTS (SELECT 1 FROM users WHERE username = $1) AS exists",
    [username],
  );
  return rows[0].exists;
}

async function createUser(username, email, hashed_password) {
  const { rows } = await con.query(
    "INSERT INTO users (username,email,hashed_password,is_email_verified,avatar_url,bio,created_at,updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id, username, email;",
    [username, email, hashed_password, false, null, null],
  );
  return rows[0];
}

async function loginUser(identifier) {
  const { rows } = await con.query(
    "SELECT * FROM users WHERE username = $1 OR email = $1;",
    [identifier],
  );

  return rows[0];
}
export { emailExists, usernameExists, createUser, loginUser };
