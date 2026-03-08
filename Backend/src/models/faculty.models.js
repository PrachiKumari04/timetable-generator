import mongoose, { model, Schema } from "mongoose";

const facultySchema = new Schema(
  {
    faculty_id: { type: String, required: true, uppercase: true, unique: true },

    faculty_name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: Number,
      required: true,
      unique: true,
    },

    specialization: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    higher_education: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    years_of_Experience: {
      type: Number,
      required: true,
      trim: true,
    },

    gender: { type: String, required: true, lowercase: true, trim: true },

    date_of_joining: {
      type: Date,
      required: true,
      trim: true,
    },

    date_of_birth: { type: Date, required: true, trim: true },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Faculty = model("Faculty", facultySchema);
