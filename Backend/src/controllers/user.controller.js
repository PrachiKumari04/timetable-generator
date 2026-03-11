import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Register new user

export const registerUser = asyncHandler(async (req, res) => {
  //multiple user details arrya of object
  const users = req.body;
  if (!Array.isArray(users) || users.length === 0) {
    throw new ApiError(400, "User data is required and must be an array");
  }
  //validate
  users.forEach((user) => {
    // if (!user.user_id) {
    //   throw new ApiError(400, "User ID is required");
    // }
    if (!user.password) {
      throw new ApiError(400, "Password is required");
    }
    if (!user.role) {
      throw new ApiError(400, "Role is required");
    }
    if (!user.createdBy) {
      throw new ApiError(400, "Created By is required");
    }
    if(!user.student_id||!user.faculty_id){
      throw new ApiError(400, "Student ID or Faculty ID is required");
    }
  });

  const userIds = users.map((user) => user.user_id);
  const existingUsers = await User.find({ user_id: { $in: userIds } });
  const existingUserIds = new Set(existingUsers.map((u) => u.user_id));
  const uniqueUserRecords = users.filter(
    (user) => !existingUserIds.has(user.user_id),
  );
  if (uniqueUserRecords.length === 0) {
    throw new ApiError(408, "All provided users already exist in the database");
  }
  const userRecords = await User.insertMany(uniqueUserRecords, {
    ordered: false,
  });
  console.log("User -->", userRecords);
  if (userRecords.length === 0) {
    throw new ApiError(500, "Failed to register users");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, "Users registered successfully", userRecords));
});

//Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  //get all user with there name and email
  const usersWithDetails = await User.find().populate({
    path: "user_id",
    select: "student_name student_id faculty_name faculty_id email ",
  });

  if (!usersWithDetails || usersWithDetails.length === 0) {
    throw new ApiError(404, "No users found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Users fetched successfully", usersWithDetails));
});

//Get all users (Original implementation placeholder)
export const getAllUsersOld = asyncHandler(async (req, res) => {
  const users = await User.find();
  if (!users || users.length === 0) {
    throw new ApiError(404, "No users found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Users fetched successfully", users));
});

// Get user by ID
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(404, "User ID is required");
  }
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "User fetched successfully", user));
});

// Update user
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(404, "User ID is required");
  }
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (!req.body) {
    throw new ApiError(404, "User data is required");
  }
  const { password, role, updatedBy, isActive } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      password,
      role,
      updatedBy,
      isActive,
    },
    { new: true },
  );
  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "User updated successfully", updatedUser));
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
    .json(new ApiResponse(200, "User deleted successfully", user));
});

// Login
export const login = asyncHandler(async (req, res) => {
  const { user_id, password } = req.body;
  if ([user_id, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields (user_id,password) are required");
  }
  const user = await User.findOne({ user_id, password });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "User logged in successfully", user));
});
