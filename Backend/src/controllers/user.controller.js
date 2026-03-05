import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";

const registerUser = asyncHandler(async (req, res) => {
    const { user_id, password, role, student_id, faculty_id } = req.body;

    if (!user_id || !password || !role) {
        throw new ApiError(400, "user_id, password, and role are required");
    }

    const existedUser = await User.findOne({ user_id });
    if (existedUser) {
        throw new ApiError(409, "User with this user_id already exists");
    }

    const user = await User.create({
        user_id,
        password,
        role,
        student_id,
        faculty_id
    });

    const createdUser = await User.findById(user._id).select("-password");

    return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { user_id, password } = req.body;

    if (!user_id || !password) {
        throw new ApiError(400, "user_id and password are required");
    }

    const user = await User.findOne({ user_id });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const token = user.generateToken();

    const loggedInUser = await User.findById(user._id).select("-password");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    return res
        .status(200)
        .cookie("token", token, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    token
                },
                "User logged in successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    return res
        .status(200)
        .clearCookie("token", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

export { registerUser, loginUser, logoutUser };
