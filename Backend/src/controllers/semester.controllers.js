import { Semester } from "../models/semester.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { paginateMongoose, parsePaginationParams } from "../utils/pagination.js";

//Add semester
export const addSemester = asyncHandler(async (req, res) => {
  const semester = req.body;

  if (Array.isArray(semester) || semester.length === 0)
    throw new ApiError(400, "Semester data is required");

  semester.forEach((sem) => {
    if (!sem.semester_id)
      throw new ApiError(400, "Semester ID is required");
    if (!sem.semester_name)
      throw new ApiError(400, "Semester name is required");
  });

  //filter  unipue data which is not stored in db
  const uniqueSemester = semester.filter((sem) => {
    return !Semester.findOne({ semester_name: sem.semester_name });
  });

  if (uniqueSemester.length === 0)
    throw new ApiError(400, "All semesters already exist in the database");

  uniqueSemester.map((sem) => {
    sem.semester_name % 2 === 0 ? (sem.isEven = true) : (sem.isEven = false);
    return sem;
  });

  const createdSemester = await Semester.insertMany(uniqueSemester);

  if (createdSemester.length === 0)
    throw new ApiError(400, "Failed to add semesters");

  res.status(201).json({
    success: true,
    message: "Semesters added successfully",
    data: createdSemester,
  });
});

// Get all semesters with pagination
export const getAllSemesters = asyncHandler(async (req, res) => {
  const { page, limit } = parsePaginationParams(req.query);
  const { search, sortBy, sortOrder, ...fieldFilters } = req.query;

  // Build filter
  let filter = {};
  
  // Search filter
  if (search) {
    filter.$or = [
      { semester_id: { $regex: search, $options: "i" } },
      { semester_name: { $regex: search, $options: "i" } },
    ];
  }
  
  // Field-specific filters
  Object.keys(fieldFilters).forEach(key => {
    if (key.startsWith('filter_') && fieldFilters[key] !== undefined && fieldFilters[key] !== '') {
      const fieldName = key.replace('filter_', '');
      const value = fieldFilters[key];
      
      // Handle boolean filters
      if (value === 'true' || value === 'false') {
        filter[fieldName] = value === 'true';
      } else {
        filter[fieldName] = value;
      }
    }
  });

  // Build sort
  let sort = {};
  if (sortBy) {
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;
  }

  const result = await paginateMongoose(Semester, filter, page, limit, { sort });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Semesters retrieved successfully"));
});

//Update semester
export const updateSemester = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { semester_id, semester_name, isEven } = req.body;

  if (!id) throw new ApiError(400, "Semester id is required");

  const semester = await Semester.findById(id);

  if (!semester) throw new ApiError(404, "Semester not found");

  //update data in db
  const updatedSemester = await Semester.findByIdAndUpdate(
    id,
    { semester_id, semester_name, isEven },
    { new: true },
  );

  if (!updatedSemester) throw new ApiError(400, "Failed to update semester");

  res.status(200).json({
    success: true,
    message: "Semester updated successfully",
    data: updatedSemester,
  });
});

//Delete semester
export const deleteSemester = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new ApiError(400, "Semester id is required");

  const semester = await Semester.findById(id);

  if (!semester) throw new ApiError(404, "Semester not found");

  await Semester.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Semester deleted successfully",
  });
});
