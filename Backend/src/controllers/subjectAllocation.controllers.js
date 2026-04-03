import { SubjectAllocation } from "../models/subjectAllocation.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Add subject allocations
export const addSubjectAllocations = asyncHandler(async (req, res) => {
  const allocations = req.body;

  if (!Array.isArray(allocations) || allocations.length === 0) {
    throw new ApiError(400, "Subject allocation data is required and must be an array");
  }

  // Validate each allocation
  allocations.forEach((alloc) => {
    if (!alloc.subjectAllocation_id) throw new ApiError(400, "Subject Allocation ID is required");
    if (!alloc.semester_id) throw new ApiError(400, "Semester ID is required");
    if (!alloc.program_id) throw new ApiError(400, "Program ID is required");
    if (!alloc.division_id) throw new ApiError(400, "Division ID is required");
    if (!alloc.faculty_id) throw new ApiError(400, "Faculty ID is required");
    if (!alloc.course_id) throw new ApiError(400, "Course ID is required");
    if (!alloc.ltpHours) throw new ApiError(400, "LTP Hours is required");
    if (!alloc.classTeacher) throw new ApiError(400, "Class Teacher is required");
    if (!alloc.academicYear) throw new ApiError(400, "Academic Year is required");
  });

  // Filter out existing allocations
  const allocIds = allocations.map((a) => a.subjectAllocation_id);
  const existingAllocs = await SubjectAllocation.find({
    subjectAllocation_id: { $in: allocIds }
  });
  const existingAllocIds = new Set(existingAllocs.map((a) => a.subjectAllocation_id));

  const uniqueAllocations = allocations.filter(
    (a) => !existingAllocIds.has(a.subjectAllocation_id)
  );

  if (uniqueAllocations.length === 0) {
    throw new ApiError(408, "All provided subject allocations already exist");
  }

  const allocRecords = await SubjectAllocation.insertMany(uniqueAllocations);

  return res
    .status(201)
    .json(new ApiResponse(201, allocRecords, "Subject allocations added successfully"));
});

// Get all subject allocations
export const getAllSubjectAllocations = asyncHandler(async (req, res) => {
  const allocations = await SubjectAllocation.find();

  if (!allocations || allocations.length === 0) {
    throw new ApiError(404, "No subject allocations found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allocations, "Subject allocations fetched successfully"));
});

// Get subject allocation by ID
export const getSubjectAllocationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new ApiError(400, "Subject Allocation ID is required");

  const allocation = await SubjectAllocation.findById(id);

  if (!allocation) {
    throw new ApiError(404, "Subject allocation not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allocation, "Subject allocation fetched successfully"));
});

// Update subject allocation
export const updateSubjectAllocation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!id) throw new ApiError(400, "Subject Allocation ID is required");

  if (!updateData || Object.keys(updateData).length === 0) {
    throw new ApiError(400, "Update data is required");
  }

  const updatedAlloc = await SubjectAllocation.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );

  if (!updatedAlloc) {
    throw new ApiError(404, "Subject allocation not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAlloc, "Subject allocation updated successfully"));
});

// Delete subject allocation
export const deleteSubjectAllocation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new ApiError(400, "Subject Allocation ID is required");

  const deletedAlloc = await SubjectAllocation.findByIdAndDelete(id);

  if (!deletedAlloc) throw new ApiError(404, "Subject allocation not found");

  return res
    .status(200)
    .json(new ApiResponse(200, deletedAlloc, "Subject allocation deleted successfully"));
});
