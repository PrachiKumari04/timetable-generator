import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ClassSubject } from "../models/classSubject.models.js";

const createClassSubject = asyncHandler(async (req, res) => {
    const classSubject = await ClassSubject.create(req.body);
    return res.status(201).json(new ApiResponse(201, classSubject, "Class Subject mapping created successfully"));
});

const getClassSubjects = asyncHandler(async (req, res) => {
    const mappings = await ClassSubject.find().populate("class_id subject_id");
    return res.status(200).json(new ApiResponse(200, mappings, "Mappings retrieved successfully"));
});

export { createClassSubject, getClassSubjects };
