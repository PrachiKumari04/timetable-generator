import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Classes } from "../models/classes.models.js";

const createClass = asyncHandler(async (req, res) => {
    const newClass = await Classes.create(req.body);
    return res.status(201).json(new ApiResponse(201, newClass, "Class created successfully"));
});

const getClasses = asyncHandler(async (req, res) => {
    const classes = await Classes.find().populate("program_id course_id");
    return res.status(200).json(new ApiResponse(200, classes, "Classes retrieved successfully"));
});

const getClassById = asyncHandler(async (req, res) => {
    const classes = await Classes.findById(req.params.id).populate("program_id course_id");
    if (!classes) throw new ApiError(404, "Class not found");
    return res.status(200).json(new ApiResponse(200, classes, "Class retrieved successfully"));
});

export { createClass, getClasses, getClassById };
