import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Faculty } from "../models/faculty.models.js";

const createFaculty = asyncHandler(async (req, res) => {
    const faculty = await Faculty.create(req.body);
    return res.status(201).json(new ApiResponse(201, faculty, "Faculty created successfully"));
});

const getFaculties = asyncHandler(async (req, res) => {
    const faculties = await Faculty.find();
    return res.status(200).json(new ApiResponse(200, faculties, "Faculties retrieved successfully"));
});

const getFacultyById = asyncHandler(async (req, res) => {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) throw new ApiError(404, "Faculty not found");
    return res.status(200).json(new ApiResponse(200, faculty, "Faculty retrieved successfully"));
});

export { createFaculty, getFaculties, getFacultyById };
