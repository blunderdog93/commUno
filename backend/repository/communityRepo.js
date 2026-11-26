import con from "../config/db.js";

async function createCommunity(owner, name, slug, desc, pfp) {
  const client = await con.connect();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      "INSERT INTO communities (name, slug, description, created_by, avatar_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, slug, desc, owner, pfp],
    );
    const community = rows[0];

    await client.query(
      `INSERT INTO community_members
       (community_id, user_id, role)
       VALUES ($1, $2, $3)`,
      [community.id, owner, "owner"],
    );
    await client.query("COMMIT");

    return community;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function communityNameExists(name) {
  const { rows } = await con.query(
    "SELECT 1 FROM communities WHERE LOWER(name) = LOWER($1) LIMIT 1",
    [name],
  );

  return rows.length > 0;
}

export { createCommunity, communityNameExists };
