import con from "./db.js";

async function connectDB() {
  try {
    await con.connect();
    console.log("Databse connected");
    return con;
  } catch (error) {
    console.log("datbase error ", error);
    throw error;
  }
}

export default connectDB;
