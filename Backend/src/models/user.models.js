import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    // user_id: {
    //   type: String,
    //   required: [true, "User ID is required"],
    //   unique: true,
    //   uppercase: true,
    //   trim: true,
    // },

    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },

    role: {
      type: String,
      required: [true, "Role is required"],
      lowercase: true,
      enum: {
        values: ["admin", "faculty", "student", "coordinator", "hod"],
        message: "{VALUE} role is not supported",
      },
      trim: true,
    },

    student_id: {
      type: String,
      default: null,
    },

    faculty_id: {
      type:String,
      default: null,
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
      default: null,
    },
  },
  { timestamps: true },
);

export const User = model("User", userSchema);
