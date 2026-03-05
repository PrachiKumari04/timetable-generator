import mongoose, { model, Schema } from "mongoose";

const classesSchema = new Schema(
    {
        class_id: { type: String, required: true, unique: true },
        program_id: { type: String, ref: "Program", required: true },
        year: { type: Number, required: true },
        course_id: { type: String, ref: "Course", required: true }
    },
    { timestamps: true }
);

export const Classes = model("Classes", classesSchema);
