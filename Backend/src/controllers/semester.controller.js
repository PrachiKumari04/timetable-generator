import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Semester } from "../models/semester.models.js";

const createSemester = asyncHandler(async (req, res) => {
    const semester = await Semester.create(req.body);
    return res.status(201).json(new ApiResponse(201, semester, "Semester created successfully"));
});

const getSemesters = asyncHandler(async (req, res) => {
    const semesters = await Semester.find();
    return res.status(200).json(new ApiResponse(200, semesters, "Semesters retrieved successfully"));
});

export { createSemester, getSemesters };
