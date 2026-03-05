import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Section } from "../models/section.models.js";

const createSection = asyncHandler(async (req, res) => {
    const section = await Section.create(req.body);
    return res.status(201).json(new ApiResponse(201, section, "Section created successfully"));
});

const getSections = asyncHandler(async (req, res) => {
    const sections = await Section.find();
    return res.status(200).json(new ApiResponse(200, sections, "Sections retrieved successfully"));
});

export { createSection, getSections };
