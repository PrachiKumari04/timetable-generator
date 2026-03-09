import { Schema, model } from "mongoose";

const programSchema = new Schema(
  {
    program_id: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    program_type: {
      type: String,
      enum: [Under_Graduate, Post_Graduate, Diploma, Post_Diploma],
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true },
);
