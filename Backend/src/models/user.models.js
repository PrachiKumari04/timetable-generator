import mongoose, { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        user_id: { type: String, required: true, unique: true },
        student_id: { type: String, ref: "Student" },
        faculty_id: { type: String, ref: "Faculty" },
        password: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        role: [{ type: String }],
        created_by: { type: String }
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            user_id: this.user_id,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET || "supersecretkey123",
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d"
        }
    );
};

export const User = model("User", userSchema);
