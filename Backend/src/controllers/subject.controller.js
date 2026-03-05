import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subject } from "../models/subject.models.js";

const createSubject = asyncHandler(async (req, res) => {
    const subject = await Subject.create(req.body);
    return res.status(201).json(new ApiResponse(201, subject, "Subject created successfully"));
});

const getSubjects = asyncHandler(async (req, res) => {
    const subjects = await Subject.find();
    return res.status(200).json(new ApiResponse(200, subjects, "Subjects retrieved successfully"));
});

const getSubjectById = asyncHandler(async (req, res) => {
    const subject = await Subject.findById(req.params.id);
    if (!subject) throw new ApiError(404, "Subject not found");
    return res.status(200).json(new ApiResponse(200, subject, "Subject retrieved successfully"));
});

export { createSubject, getSubjects, getSubjectById };
