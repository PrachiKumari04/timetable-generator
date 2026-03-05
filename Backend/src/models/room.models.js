import mongoose, { model, Schema } from "mongoose";

const roomSchema = new Schema(
    {
        room_id: { type: String, required: true, unique: true },
        floor: { type: String, required: true },
        wings: { type: String, required: true }
    },
    { timestamps: true }
);

export const Room = model("Room", roomSchema);
