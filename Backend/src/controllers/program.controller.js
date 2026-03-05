import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Program } from "../models/program.models.js";

const createProgram = asyncHandler(async (req, res) => {
    const program = await Program.create(req.body);
    return res.status(201).json(new ApiResponse(201, program, "Program created successfully"));
});

const getPrograms = asyncHandler(async (req, res) => {
    const programs = await Program.find();
    return res.status(200).json(new ApiResponse(200, programs, "Programs retrieved successfully"));
});

const getProgramById = asyncHandler(async (req, res) => {
    const program = await Program.findById(req.params.id);
    if (!program) throw new ApiError(404, "Program not found");
    return res.status(200).json(new ApiResponse(200, program, "Program retrieved successfully"));
});

export { createProgram, getPrograms, getProgramById };
