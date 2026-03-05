import mongoose, { model, Schema } from "mongoose";

const facultySchema = new Schema(
    {
        faculty_id: { type: String, required: true, unique: true },
        faculty_name: { type: String, required: true },
        specialization: { type: String },
        higher_education: { type: String },
        gender: { type: String },
        date_of_joining: { type: Date },
        DOB: { type: Date },
        address: { type: String },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

export const Faculty = model("Faculty", facultySchema);
