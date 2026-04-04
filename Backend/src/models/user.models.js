import mongoose, { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: [6, "Password must be at least 6 characters long"],
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
      type: String,
      default: null,
    },

    refreshToken: {
      type: String,
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

// Pre-save hook to hash password
userSchema.pre("save", async function () {
  try {
    // Hash password if modified
    if (this.isModified("password")) {
      const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }

  } catch (error) {
    // Handle error
    console.error("Error in userSchema pre-save hook:", error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = model("User", userSchema);
