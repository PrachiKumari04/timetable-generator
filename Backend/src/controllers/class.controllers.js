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
    (cls) => !existingClassIds.has(cls.class_id),
  );

  if (uniqueClassRecords.length === 0) {
    throw new ApiError(408, "All provided classes already exist");
  }

  const classRecords = await Class.insertMany(uniqueClassRecords);

  return res
    .status(201)
    .json(
      new ApiResponse(201, classRecords, "Classes registered successfully"),
    );
});

// Get all classes
export const getAllClasses = asyncHandler(async (req, res) => {
  const classes = await Class.aggregate([
    {
      $lookup: {
        from: "programs",
        localField: "program_id",
        foreignField: "_id",
        as: "program",
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "course_id",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: {
        path: "$program",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$course",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);

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

  if (!id) throw new ApiError(400, "Class ID is required");

  const classData = await Class.aggregate([
    {
      $match: {
        _id: id,
      },
    },
    {
      $lookup: {
        from: "programs",
        localField: "program_id",
        foreignField: "_id",
        as: "program",
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "course_id",
        foreignField: "_id",
        as: "course",
      },
    },
  ]);

  if (!classData) {
    throw new ApiError(404, "Class not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, classData, "Class fetched successfully"));
});

//get class by class_id
export const getClassByClassId = asyncHandler(async (req, res) => {
  const { class_id } = req.params;

  if (!class_id) throw new ApiError(400, "Class ID is required");

  const classData = await Class.aggregate([
    {
      $match: {
        class_id: class_id,
      },
    },
  ]);

  if (!classData) {
    throw new ApiError(404, "Class not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, classData, "Class fetched successfully"));
});

// Update class
export const updateClass = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const classData = req.body;

  if (!id) throw new ApiError(400, "Class ID is required");

  if (!classData) throw new ApiError(400, "Class data is required");

  const updatedClass = await Class.findByIdAndUpdate(id, classData, {
    new: true,
  });

  if (!updatedClass) {
    throw new ApiError(404, "Class not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedClass, "Class updated successfully"));
});

// Delete class
export const deleteClass = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new ApiError(400, "Class ID is required");

  const deletedClass = await Class.findByIdAndDelete(id);

  if (!deletedClass) throw new ApiError(404, "Class not found");

  res
    .status(200)
    .json(new ApiResponse(200, deletedClass, "Class deleted successfully"));
});
