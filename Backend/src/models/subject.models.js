import { Schema, model } from "mongoose";

const subjectSchema = new Schema(
  {
    subject_id: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    subject_name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    subjectCredit: {
      type: Number,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Subject = model("Subject", subjectSchema);
