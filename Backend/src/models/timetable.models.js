import mongoose, { model, Schema } from "mongoose";

const timetableSchema = new Schema(
    {
        timetable_id: { type: String, required: true, unique: true },
        semester_id: { type: String, ref: "Semester", required: true },
        class_id: { type: String, ref: "Classes", required: true },
        section_id: { type: String, ref: "Section", required: true },
        subject_id: { type: String, ref: "Subject", required: true },
        faculty_id: { type: String, ref: "Faculty", required: true },
        room_id: { type: String, ref: "Room", required: true },
        day_of_week: {
            type: String,
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            required: true
        },
        time_slot: { type: String, required: true } // format e.g. "09:00-10:00"
    },
    { timestamps: true }
);

export const Timetable = model("Timetable", timetableSchema);
