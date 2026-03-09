import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      unique: true,
      refPath: "role",
    },
    user_data: {
      type: Schema.Types.ObjectId,
      unique: true,
      refPath: "role",
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const User = model("User", userSchema);
