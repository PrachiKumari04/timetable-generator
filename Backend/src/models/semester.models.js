import mongoose, { model, Schema } from "mongoose";

const semesterSchema = new Schema(
  {
    semester_id: { type: String, required: true, unique: true },
    semester_name: { type: String, required: true },
    type: { type: String, enum: ["even", "odd"], required: true }
  },
  { timestamps: true }
);

export const Semester = model("Semester", semesterSchema);
