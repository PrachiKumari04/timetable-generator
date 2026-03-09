import { Schema, model } from "mongoose";

const classSchema = new Schema({
  class_id: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  program_id: {
    type: Schema.Types.ObjectId,
    ref: "Program",
  },
  year: {
    type: Number,
    required: true,
    trim: true,
  },
  course_id: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
},{timestamps:true});

export const Class = model("Class", classSchema);
