import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/student.models.js";

const createStudent = asyncHandler(async (req, res) => {
    const student = await Student.create(req.body);
    return res.status(201).json(new ApiResponse(201, student, "Student created successfully"));
});

const getStudents = asyncHandler(async (req, res) => {
    const students = await Student.find();
    return res.status(200).json(new ApiResponse(200, students, "Students retrieved successfully"));
});

const getStudentById = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (!student) throw new ApiError(404, "Student not found");
    return res.status(200).json(new ApiResponse(200, student, "Student retrieved successfully"));
});

export { createStudent, getStudents, getStudentById };
