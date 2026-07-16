import mongoose from "mongoose";
import { DB_NAME } from "../constenets.js";

//* Database connection function
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/"}${DB_NAME}`,
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    //! Critical error - exit process if DB connection fails
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB;
