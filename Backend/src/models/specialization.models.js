import { Schema, model } from "mongoose";

const specilizationSchema = new Schema(
  {
    specilization_id: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    specilization_name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    program_id: {
      type: Schema.Types.ObjectId,
      ref: "Program",
    },
    course_id: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Specilization = model("Specilization", specilizationSchema);
