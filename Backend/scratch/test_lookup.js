import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/user.models.js";
dotenv.config();

const run = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/timetable";
    await mongoose.connect(mongoUri);

    const user = await User.findOne({ user_id: "STUADT25COMM0873" });

    const userWithDetails = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(user._id) } },
      {
        $lookup: {
          from: "students",
          localField: "student_id",
          foreignField: "student_id",
          as: "student_data",
        },
      },
      {
        $lookup: {
          from: "faculties",
          localField: "faculty_id",
          foreignField: "faculty_id",
          as: "faculty_data",
        },
      },
      {
        $addFields: {
          user_data: {
            $cond: {
              if: { $gt: [{ $size: "$student_data" }, 0] },
              then: { $arrayElemAt: ["$student_data", 0] },
              else: { $arrayElemAt: ["$faculty_data", 0] },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          role: 1,
          isActive: 1,
          user_id: 1,
          student_id: 1,
          faculty_id: 1,
          user_name: {
            $cond: {
              if: { $ne: ["$student_id", null] },
              then: "$user_data.student_name",
              else: "$user_data.faculty_name",
            },
          },
          email: "$user_data.email",
          class_group: {
            $cond: {
              if: { $ne: ["$student_id", null] },
              then: "$user_data.class",
              else: null,
            },
          },
          class: "$user_data.class",
          specialization: "$user_data.specialization",
          batch: "$user_data.batch",
        },
      },
    ]);

    console.log("UserWithDetails[0]:", userWithDetails[0]);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
