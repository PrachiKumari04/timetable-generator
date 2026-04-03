import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  generateTokens,
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  verifyRefreshToken,
} from "../utils/Token.js";
import mongoose from "mongoose";

// Register new user (single or multiple)
export const registerUser = asyncHandler(async (req, res) => {
  const users = req.body;

  console.log("Body -->", req.body);
  
  // Handle single user registration
  if (!Array.isArray(users)) {
    const { password, role, student_id, faculty_id, created_by } = users;
    
    // Validate required fields
    if (!password || !role || (!student_id && !faculty_id)) {
      throw new ApiError(400, "Password, role, and student_id or faculty_id are required");
    }

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [
        { student_id: student_id || null },
        { faculty_id: faculty_id || null },
      ],
    });

    if (existingUser) {
      throw new ApiError(409, "User with this student_id or faculty_id already exists");
    }

    // Create user
    const newUser = await User.create({
      password,
      role: role.toLowerCase(),
      student_id: student_id || null,
      faculty_id: faculty_id || null,
      created_by: created_by || null,
    });

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered successfully"));
  }

  // Handle multiple user registration (bulk)
  if (users.length === 0) {
    throw new ApiError(400, "User data is required and must be an array");
  }

  // Validate each user
  users.forEach((user) => {
    if (!user.password) {
      throw new ApiError(400, "Password is required");
    }
    if (!user.role) {
      throw new ApiError(400, "Role is required");
    }
    if (!user.student_id && !user.faculty_id) {
      throw new ApiError(400, "Student ID or Faculty ID is required");
    }
  });

  // Find unique records
  const studentIds = users.filter((u) => u.student_id).map((u) => u.student_id);
  const facultyIds = users.filter((u) => u.faculty_id).map((u) => u.faculty_id);

  const existingUsers = await User.find({
    $or: [
      { student_id: { $in: studentIds } },
      { faculty_id: { $in: facultyIds } },
    ],
  });

  const existingStudentIds = new Set(
    existingUsers
      .filter((u) => u.student_id)
      .map((u) => u.student_id.toString()),
  );
  const existingFacultyIds = new Set(
    existingUsers
      .filter((u) => u.faculty_id)
      .map((u) => u.faculty_id.toString()),
  );

  const uniqueUserRecords = users.filter((user) => {
    if (user.student_id && existingStudentIds.has(user.student_id.toString())) {
      return false;
    }
    if (user.faculty_id && existingFacultyIds.has(user.faculty_id.toString())) {
      return false;
    }
    return true;
  });

  if (uniqueUserRecords.length === 0) {
    throw new ApiError(409, "All provided users already exist in the database");
  }

  console.log("Unique User Records -->", uniqueUserRecords);

  // Save in database
  const userRecords = await User.insertMany(uniqueUserRecords);
  console.log("User -->", userRecords);

  if (userRecords.length === 0) {
    throw new ApiError(500, "Failed to register users");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, userRecords, "Users registered successfully"),
    );
});

//Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  //get all user with there name and email
  const usersWithDetails = await User.aggregate([
    {
      $lookup: {
        from: "students",
        localField: "student_id",
        foreignField: "student_id",
        as: "student_data",
      },
    },

    {
      $lookup: {
        from: "faculties",
        localField: "faculty_id",
        foreignField: "faculty_id",
        as: "faculty_data",
      },
    },
    {
      $addFields: {
        user_data: {
          $cond: {
            if: { $gt: [{ $size: "$student_data" }, 0] },
            then: { $arrayElemAt: ["$student_data", 0] },
            else: { $arrayElemAt: ["$faculty_data", 0] },
          },
        },
      },
    },
    {
      $project: {
        password: 0,
        student_data: 0,
        faculty_data: 0,
      },
    },
    { $unwind: "$user_data" },
    {
      $project: {
        role: 1,
        user_id: {
          $cond: {
            if: { $eq: ["$faculty_id", null] },
            then: "$student_id",
            else: "$faculty_id",
          },
        },
        user_name: {
          $cond: {
            if: { $eq: ["$faculty-id", null] },
            then: "$user_data.student_name",
            else: "$user_data.faculty_name",
          },
        },

        email: "$user_data.email",
        isActive: 1,
        created_by: 1,
        updated_by: 1,
        createdAt: 1,
        updatedAt: 1,
        _id: 1,
      },
    },
  ]);

  if (usersWithDetails.length === 0) {
    throw new ApiError(404, "No users found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, usersWithDetails[0], "Users fetched successfully"),
    );
});

// Get user by ID
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("User Id -->", id);
  if (!id) {
    throw new ApiError(404, "User ID is required");
  }

  //Fatching data from database
  const getUserData = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "students",
        localField: "student_id",
        foreignField: "student_id",
        as: "student_data",
      },
    },
    {
      $lookup: {
        from: "faculties",
        localField: "faculty_id",
        foreignField: "faculty_id",
        as: "faculty_data",
      },
    },
    {
      $addFields: {
        user_data: {
          $cond: {
            if: { $gt: [{ $size: "$student_data" }, 0] },
            then: { $arrayElemAt: ["$student_data", 0] },
            else: { $arrayElemAt: ["$faculty_data", 0] },
          },
        },
      },
    },
    {
      $project: {
        role: 1,
        user_id: {
          $cond: {
            if: { $eq: ["$faculty_id", null] },
            then: "$student_id",
            else: "$faculty_id",
          },
        },
        user_name: {
          $cond: {
            if: { $eq: ["$faculty_id", null] },
            then: "$user_data.student_name",
            else: "$user_data.faculty_name",
          },
        },
        email: "$user_data.email",
        isActive: 1,
        created_by: 1,
        updated_by: 1,
        createdAt: 1,
        updatedAt: 1,
        _id: 1,
      },
    },
  ]);
  console.log("User -->", getUserData);

  if (getUserData.length === 0) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, getUserData[0], "User fetched successfully"));
});

// Update user
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "User ID is required");
  }
  
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ApiError(400, "User data is required");
  }
  
  const { password, role, updated_by, isActive } = req.body;
  
  // Build update object
  const updateData = {};
  if (role) updateData.role = role;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (updated_by) updateData.updated_by = updated_by;
  
  // Handle password update separately to trigger hashing
  if (password) {
    if (password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters long");
    }
    user.password = password;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (updated_by) user.updated_by = updated_by;
    
    const updatedUser = await user.save();
    const userResponse = await User.findById(updatedUser._id).select("-password -refreshToken");
    
    return res
      .status(200)
      .json(new ApiResponse(200, userResponse, "User updated successfully"));
  }
  
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true },
  ).select("-password -refreshToken");
  
  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }
  
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

// Delete user
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(404, "User ID is required");
  }
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User deleted successfully"));
});

// Login with password hashing and JWT tokens
export const userLogin = asyncHandler(async (req, res) => {
  const { user_id, password } = req.body;
  
  // Validate input
  if (!user_id?.trim() || !password?.trim()) {
    throw new ApiError(400, "User ID and password are required");
  }
  
  console.log("User Id -->", user_id);

  // Find user by student_id or faculty_id
  const user = await User.findOne({
    $or: [{ student_id: user_id }, { faculty_id: user_id }],
  });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Check if user is active
  if (!user.isActive) {
    throw new ApiError(403, "Account is deactivated. Please contact admin.");
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user);

  // Save refresh token to database
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Get user details with student/faculty info
  const userWithDetails = await User.aggregate([
    { $match: { _id: user._id } },
    {
      $lookup: {
        from: "students",
        localField: "student_id",
        foreignField: "student_id",
        as: "student_data",
      },
    },
    {
      $lookup: {
        from: "faculties",
        localField: "faculty_id",
        foreignField: "faculty_id",
        as: "faculty_data",
      },
    },
    {
      $addFields: {
        user_data: {
          $cond: {
            if: { $gt: [{ $size: "$student_data" }, 0] },
            then: { $arrayElemAt: ["$student_data", 0] },
            else: { $arrayElemAt: ["$faculty_data", 0] },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        role: 1,
        isActive: 1,
        user_id: {
          $cond: {
            if: { $ne: ["$student_id", null] },
            then: "$student_id",
            else: "$faculty_id",
          },
        },
        user_name: {
          $cond: {
            if: { $ne: ["$student_id", null] },
            then: "$user_data.student_name",
            else: "$user_data.faculty_name",
          },
        },
        email: "$user_data.email",
      },
    },
  ]);

  console.log("User logged in -->", userWithDetails[0]);

  // Set cookies and send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: userWithDetails[0],
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

// Logout user
export const logoutUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  // Clear refresh token from database
  await User.findByIdAndUpdate(
    userId,
    { $set: { refreshToken: null } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", { httpOnly: true, secure: process.env.NODE_ENV === "production" })
    .clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === "production" })
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Refresh access token
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request - No refresh token");
  }

  // Verify refresh token
  const decodedToken = verifyRefreshToken(incomingRefreshToken);

  if (!decodedToken) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  // Find user
  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  // Check if refresh token matches
  if (user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is expired or used");
  }

  // Generate new tokens
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

  // Update refresh token in database
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access token refreshed successfully"
      )
    );
});

// Change password
export const changePassword = asyncHandler(async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    throw new ApiError(400, "User ID, current password, and new password are required");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters long");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, "Current password is incorrect");
  }

  // Update password (will be hashed by pre-save middleware)
  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});
