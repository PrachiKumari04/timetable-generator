import { model, Schema } from "mongoose";

const studentSchema = new Schema(
  {
    student_id: {
      type: String,
      required: [true, "Student id is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },

    student_name: {
      type: String,
      required: [true, "Student name is required"],
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    father_name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    class_code: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    batch: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    date_of_birth: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    specialization: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Student = model("Student", studentSchema);
