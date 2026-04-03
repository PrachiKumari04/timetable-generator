import mongoose, { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    user_id: {
      type: String,
      required: [true, "User ID is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },

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

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate user_id based on role and student/faculty id
userSchema.pre("save", async function (next) {
  if (this.isNew && !this.user_id) {
    if (this.student_id) {
      this.user_id = `STU_${this.student_id}`;
    } else if (this.faculty_id) {
      this.user_id = `FAC_${this.faculty_id}`;
    }
  }
  next();
});

export const User = model("User", userSchema);
