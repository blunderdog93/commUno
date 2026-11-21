import app from "./src/app.js";
import connectDB from "./config/connectDB.js";

async function startServer() {
  try {
    const db = await connectDB();
    app.listen(3000, () => {
      console.log("The sever is running");
    });
  } catch (error) {
    console.log("Failed to start server ", error);
    process.exit(1);
  }
}
startServer();
