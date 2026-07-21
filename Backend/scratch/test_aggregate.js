import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    const u = await db.collection("users").findOne({ user_id: "STUADT25COMM0873" });
    console.log("User:", u);

    const res = await db.collection("users").aggregate([
      { $match: { _id: u._id } },
      {
        $lookup: {
          from: "students",
          localField: "student_id",
          foreignField: "student_id",
          as: "student_data",
        },
      },
    ]).toArray();

    console.log("Aggregate Result:", JSON.stringify(res, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
