import { Schema, model } from "mongoose";

const semesterSchema = new Schema(
  {
    // semester_id: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   uppercase: true,
    //   trim: true,
    // },
    semester_name: {
      type: Number,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    isEven: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Semester = model("Semester", semesterSchema);
