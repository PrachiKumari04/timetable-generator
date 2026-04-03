import mongoose, { model, Schema } from "mongoose";

const facultySchema = new Schema(
  {
    faculty_id: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    faculty_name: {
      type: String,
      required: [true, "Faculty name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, "specialization is required"],
      lowercase: true,
      trim: true,
    },

    higher_qualification: {
      type: String,
      required: [true, "higher education is required"],
      uppercase: true,
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
