import mongoose, { model, Schema } from "mongoose";

const sectionSchema = new Schema(
    {
        section_id: { type: String, required: true, unique: true },
        class_id: { type: String, ref: "Classes", required: true }
    },
    { timestamps: true }
);

export const Section = model("Section", sectionSchema);
