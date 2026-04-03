import { Schema, model } from "mongoose";

const subjectAllocationSchema = new Schema(
  {
    semester_id: {
      type: String,
      required: [true, "Semester ID is required"],
      required: true,
      uppercase: true,
      trim: true,
    },
    program_id: {
      type: String,
      required: [true, "Program ID is required"],
      required: true,
      uppercase: true,
      trim: true,
    },
    division_id: {
      type: String,
      required: [true, "Division ID is required"],
      required: true,
      uppercase: true,
      trim: true,
    },
    subjectAllocation_id: {
      type: String,
      required: [true, "Subject Allocation ID is required"],
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    ltpHours: {
      l: { type: Number, required: [true, "LTP hours is required"] },
      t: { type: Number, required: [true, "LTP hours is required"] },
      p: { type: Number, required: [true, "LTP hours is required"] },
      required: [true, "LTP hours is required"],
    },
    isLab: {
      type: Boolean,
      default: false,   
    },
    classTeacher: {
      type: String,
      required: [true, "Class teacher is required"],
      uppercase: true,
      trim: true,
    },
    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
      uppercase: true,
      trim: true,
    },
    faculty_id: {
      type: String,
      required: [true, "Faculty ID is required"],
      uppercase: true,
      trim: true,
    },
    course_id: {
      type: String,
      required: [true, "Course ID is required"],
      uppercase: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const SubjectAllocation = model("SubjectAllocation", subjectAllocationSchema);
