import mongoose, { model, Schema } from "mongoose";

const programSchema = new Schema(
    {
        program_id: { type: String, required: true, unique: true },
        type: [{ type: String, enum: ["UG", "PG"] }]
    },
    { timestamps: true }
);

export const Program = model("Program", programSchema);
