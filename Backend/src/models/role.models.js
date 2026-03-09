import { model, Schema } from "mongoose";

const roleSchema = new Schema(
  {
    role_id: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    role_name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    role_description: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const Role = model("Role", roleSchema);
