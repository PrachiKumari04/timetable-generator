import { model, Schema } from "mongoose";
import { Course } from "./course.models";
import { Specilization } from "./specialization.models";

const hodSchema = new Schema(
  {
    program_id: {
      type: Schema.Types.ObjectId,
      ref: "Program",
    },
    faculty_id: {
      type: Schema.Types.ObjectId,
      ref: "Faculty",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    course_id: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    Specilization_id: {
      type: Schema.Types.ObjectId,
      ref: "Specilization",
    },
    semester_id: {
      type: Schema.Types.ObjectId,
      ref: "Semester",
    },
    class_id: {
      type: Schema.Types.ObjectId,
      ref: "Class",
    },
    section_id: {
      type: Schema.Types.ObjectId,
      ref: "Section",
    },
    subject_id: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
    },
    room_id: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    isLab: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true },
);

export const Hod = model("Hod", hodSchema);
