import { Schema, model } from "mongoose";

const roomSchema = new Schema(
  {
    room_no: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    floor_no: {
      type: String,
      required: true,
      trim: true,
    },
    block: {
      type: String,
      required: true, 
      uppercase: true,
      trim: true,
    },
    isLab: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Room = model("Room", roomSchema);
