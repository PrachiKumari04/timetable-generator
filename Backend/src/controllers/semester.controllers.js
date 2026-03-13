import { Semester } from "../models/semester.models";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

//Add semester
export const addSemester = asyncHandler(async (req, res) => {
  const semester = req.body;

  if (Array.isArray(semester) || semester.length === 0)
    throw new ApiError(400, "Semester data is required");

  semester.forEach((sem) => {
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

//Get all semesters
export const getAllSemesters = asyncHandler(async (req, res) => {
  const semesters = await Semester.find();

  if (semesters.length === 0) throw new ApiError(404, "No semesters found");

  res.status(200).json({
    success: true,
    message: "Semesters fetched successfully",
    data: semesters,
  });
});

//Update semester
export const updateSemester = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { semester_name, isEven } = req.body;

  if (!id) throw new ApiError(400, "Semester id is required");

  const semester = await Semester.findById(id);

  if (!semester) throw new ApiError(404, "Semester not found");

  //update data in db
  const updatedSemester = await Semester.findByIdAndUpdate(
    id,
    { semester_name, isEven },
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
