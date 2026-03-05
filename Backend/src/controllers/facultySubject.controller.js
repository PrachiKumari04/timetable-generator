import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { FacultySubject } from "../models/facultySubject.models.js";

const createFacultySubject = asyncHandler(async (req, res) => {
    const mapping = await FacultySubject.create(req.body);
    return res.status(201).json(new ApiResponse(201, mapping, "Faculty Subject mapping created successfully"));
});

const getFacultySubjects = asyncHandler(async (req, res) => {
    const mappings = await FacultySubject.find().populate("faculty_id subject_id");
    return res.status(200).json(new ApiResponse(200, mappings, "Mappings retrieved successfully"));
});

export { createFacultySubject, getFacultySubjects };
