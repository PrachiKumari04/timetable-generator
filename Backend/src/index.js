import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./server.js";

dotenv.config({ path: "./.env" });
const port = process.env.PORT || 5000;

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Database connection faild !!", error);
    });
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((error) => console.error("Error connecting to MongoDB:", error));