import mongoose, { model, Schema } from "mongoose";

const courseSchema = new Schema(
    {
        course_id: { type: String, required: true, unique: true },
        course_name: { type: String, required: true },
        course_duration: { type: String, required: true }
    },
    { timestamps: true }
);

export const Course = model("Course", courseSchema);
