import mongoose, { model, Schema } from "mongoose";

const facultySchema = new Schema(
  {
    faculty_id: { type: String, required: true, uppercase: true },

    faculty_name: {
      type: String,
      required: [true, "Faculty name is required"],
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

    phone: {
      type: Number,
      required: [true, "phone number must be a number and exactly 10 digits"],
      unique: true,
    },

    specialization: {
      type: String,
      required: [true, "specialization is required"],
      lowercase: true,
      trim: true,
    },

    higher_education: {
      type: String,
      required: [true, "higher education is required"],
      lowercase: true,
      trim: true,
    },

    years_of_Experience: {
      type: Number,
      required: [true, "years of experience is required"],
      trim: true,
    },

    gender: {
      type: String,
      required: [true, "gender is required"],
      lowercase: true,
      trim: true,
    },

    date_of_joining: {
      type: Date,
      default: Date.now,
    },

    date_of_birth: {
      type: Date,
    },

    address: {
      type: String,
      required: [true, "address is required"],
      trim: true,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Faculty = model("Faculty", facultySchema);
