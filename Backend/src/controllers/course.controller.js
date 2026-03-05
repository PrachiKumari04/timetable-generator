import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/course.models.js";

const createCourse = asyncHandler(async (req, res) => {
    const course = await Course.create(req.body);
    return res.status(201).json(new ApiResponse(201, course, "Course created successfully"));
});

const getCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find();
    return res.status(200).json(new ApiResponse(200, courses, "Courses retrieved successfully"));
});

const getCourseById = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) throw new ApiError(404, "Course not found");
    return res.status(200).json(new ApiResponse(200, course, "Course retrieved successfully"));
});

export { createCourse, getCourses, getCourseById };
