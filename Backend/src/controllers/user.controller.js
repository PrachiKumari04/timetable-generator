import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// Register new user
export const registerUser = asyncHandler(async (req, res) => {
  //multiple user details arrya of object
  const users = req.body;

  console.log("Body -->", req.body);
  //validate
  if (!Array.isArray(users) || users.length === 0) {
    throw new ApiError(400, "User data is required and must be an array");
  }
  //validate
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

  //find unique records
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
    throw new ApiError(408, "All provided users already exist in the database");
  }

  console.log("Unique User Records -->", uniqueUserRecords);

  //save in database
  const userRecords = await User.insertMany(uniqueUserRecords);
  console.log("User -->", userRecords);

  if (userRecords.length === 0) {
    throw new ApiError(500, "Failed to register users");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(201, userRecords[0], "Users registered successfully"),
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
    { $set: { password, role, updatedBy, isActive } },
    { new: true },
  );
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

// Login
export const userLogin = asyncHandler(async (req, res) => {
  const { user_id, password } = req.body;
  if ([user_id, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields (user_id,password) are required");
  }
  console.log("User Id -->", user_id);
  console.log("Password -->", password);

  const user = await User.aggregate([
    {
      $match: {
        $or: [{ student_id: user_id }, { faculty_id: user_id }],
        password: password,
      },
    },
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
  console.log("User -->", user);

  if (user.length === 0) {
    throw new ApiError(401, "Invalid credentials");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user[0], "User logged in successfully"));
});
