import mongoose, { model, Schema } from "mongoose";

const subjectSchema = new Schema(
    {
        subject_id: { type: String, required: true, unique: true },
        subject_name: { type: String, required: true },
        credits: { type: Number, required: true },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

export const Subject = model("Subject", subjectSchema);
