import { Class } from "../models/class.models";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";


export const registerClass = asyncHandler(async (req, res) => {
  const classes = req.body;

  if (!Array.isArray(classes) || classes.length === 0) {
    throw new ApiError(400, "Class data is required and must be an array");
  }

  classes.forEach((cls) => {
    if (!cls.class_id) throw new ApiError(400, "Class ID is required");
    if (!cls.year) throw new ApiError(400, "Year is required");
  });

  const classIds = classes.map((cls) => cls.class_id);
  const existingClasses = await Class.find({ class_id: { $in: classIds } });
  const existingClassIds = new Set(existingClasses.map((cls) => cls.class_id));

  const uniqueClassRecords = classes.filter(
    (cls) => !existingClassIds.has(cls.class_id)
  );

  if (uniqueClassRecords.length === 0) {
    throw new ApiError(408, "All provided classes already exist");
  }

  const classRecords = await Class.insertMany(uniqueClassRecords);

  return res
    .status(201)
    .json(new ApiResponse(201, classRecords, "Classes registered successfully"));
});

// Get all classes
export const getAllClasses = asyncHandler(async (req, res) => {
  const classes = await Class.find()
    .populate("program_id")
    .populate("course_id");

  if (!classes || classes.length === 0) {
    throw new ApiError(404, "No classes found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, classes, "Classes fetched successfully"));
});

// Get class by ID
export const getClassById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const classData = await Class.findById(id)
    .populate("program_id")
    .populate("course_id");

  if (!classData) {
    throw new ApiError(404, "Class not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, classData, "Class fetched successfully"));
});