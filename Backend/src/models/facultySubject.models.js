import mongoose, { model, Schema } from "mongoose";

const facultySubjectSchema = new Schema(
    {
        mapping_id: { type: String, required: true, unique: true },
        faculty_id: { type: String, ref: "Faculty", required: true },
        subject_id: { type: String, ref: "Subject", required: true }
    },
    { timestamps: true }
);

export const FacultySubject = model("FacultySubject", facultySubjectSchema);
