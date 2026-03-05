import mongoose, { model, Schema } from "mongoose";

const classSubjectSchema = new Schema(
    {
        mapping_id: { type: String, required: true, unique: true },
        class_id: { type: String, ref: "Classes", required: true },
        subject_id: { type: String, ref: "Subject", required: true },
        lectures_per_week: { type: Number, required: true }
    },
    { timestamps: true }
);

export const ClassSubject = model("ClassSubject", classSubjectSchema);
