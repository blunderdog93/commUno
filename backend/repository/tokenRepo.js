import con from "../config/db.js";

async function createVerificationToken(userId, tokenHash, expiresAt) {
  const { rows } = await con.query(
    "INSERT INTO email_verification_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3) RETURNING id",
    [userId, tokenHash, expiresAt],
  );
  return rows[0];
}

async function returnId(tokenHash) {
  const { rows } = await con.query(
    "SELECT user_id FROM email_verification_tokens WHERE token_hash = $1",
    [tokenHash],
  );
  return rows[0]?.user_id;
}

async function verifyUserEmail(userId, tokenHash) {
  const client = await con.connect();

  try {
    await client.query("BEGIN");

    // Validate and consume token
    const { rows: tokenRows } = await client.query(
      `UPDATE email_verification_tokens
             SET used = TRUE
             WHERE user_id = $1
             AND token_hash = $2
             AND expires_at > NOW()
             AND used = FALSE
             RETURNING user_id`,
      [userId, tokenHash],
    );

    console.log("Token rows:", tokenRows);

    if (tokenRows.length === 0) {
      await client.query("ROLLBACK");
      return false;
    }

    // Verify user
    const { rows: userRows } = await client.query(
      `UPDATE users
             SET is_email_verified = TRUE
             WHERE id = $1
             RETURNING id, email, is_email_verified`,
      [userId],
    );

    console.log("User rows:", userRows);

    if (userRows.length === 0) {
      await client.query("ROLLBACK");
      return false;
    }

    await client.query("COMMIT");

    return userRows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function storeRefreshToken(userId, tokenHash, expiresAt) {
  const { rows } = await con.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [userId, tokenHash, expiresAt],
  );

  return rows[0];
}

async function updateRefreshToken(tokenHash, newTokenHash) {
  const { rows } = await con.query(
    "UPDATE refresh_tokens SET token_hash = $1, expires_at = $2 WHERE token_hash = $3 AND expires_at > NOW() AND revoked = FALSE RETURNING id ",
    [newTokenHash, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), tokenHash],
  );
  return rows[0];
}

async function revokeToken(tokenHash) {
  const { rows } = await con.query(
    "UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash =$1 AND revoked = FALSE",
    [tokenHash],
  );
  return rows[0];
}

export {
  createVerificationToken,
  verifyUserEmail,
  returnId,
  storeRefreshToken,
  updateRefreshToken,
  revokeToken,
};
