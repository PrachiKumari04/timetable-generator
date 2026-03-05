import mongoose, { model, Schema } from "mongoose";

const studentSchema = new Schema(
    {
        student_id: { type: String, required: true, unique: true },
        student_name: { type: String, required: true },
        gender: { type: String },
        father_name: { type: String },
        class: { type: String },
        batch: { type: String },
        specialization: { type: String }
    },
    { timestamps: true }
);

export const Student = model("Student", studentSchema);
