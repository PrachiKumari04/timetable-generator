import mongoose, { model, Schema } from "mongoose";

const specializationSchema = new Schema(
    {
        specialization_id: { type: String, required: true, unique: true },
        program_id: { type: String, ref: "Program" },
        course_id: { type: String, ref: "Course" },
        specialization_name: { type: String, required: true }
    },
    { timestamps: true }
);

export const Specialization = model("Specialization", specializationSchema);
