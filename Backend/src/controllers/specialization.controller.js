import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Specialization } from "../models/specialization.models.js";

const createSpecialization = asyncHandler(async (req, res) => {
    const specialization = await Specialization.create(req.body);
    return res.status(201).json(new ApiResponse(201, specialization, "Specialization created successfully"));
});

const getSpecializations = asyncHandler(async (req, res) => {
    const specializations = await Specialization.find();
    return res.status(200).json(new ApiResponse(200, specializations, "Specializations retrieved successfully"));
});

export { createSpecialization, getSpecializations };
