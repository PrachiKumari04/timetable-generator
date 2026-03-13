import { Specilization } from "../models/specialization.models";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

//Add specialization
export const addSpecialization = asyncHandler(async (req, res) => {
  const specialization = req.body;

  if (Array.isArray(specialization) || specialization.length === 0)
    throw new ApiError(400, "Specialization data is required");

  //validate
  specialization.forEach((s) => {
    if (!s.specilization_name)
      throw new ApiError(400, "Specialization name is required");
    if (!s.program_id) throw new ApiError(400, "Program id is required");
    if (!s.course_id) throw new ApiError(400, "Course id is required");
  });

  //find unique records which is not  stored in db
  const uniqueSpecialization = specialization.filter((s) => {
    return !Specilization.findOne({ specilization_name: s.specilization_name });
  });

  if (uniqueSpecialization.length === 0)
    throw new ApiError(400, "All Specialization already exists");

    const createdSpecialization = await Specilization.insertMany(uniqueSpecialization);

    if(createdSpecialization.length === 0 )throw new ApiError(400, "Something went wrong");


  res.status(200).json({
    success: true,
    message: "Specialization added successfully",
    data: createdSpecialization,
  });
});

//Get all specialization
export const getAllSpecialization = asyncHandler(async (req, res) => {
    
    const specialization = await Specilization.find().populate("program_id").populate("course_id");

    if(specialization.length === 0) throw new ApiError(404, "No specialization found");

    res.status(200).json({
        success: true,
        message: "Specialization fetched successfully",
        data: specialization,
      });
});

//Get specialization by id
export const getSpecializationById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const specialization = await Specilization.findById(id).populate("program_id").populate("course_id");
    if(!specialization) throw new ApiError(404, "No specialization found");

    res.status(200).json({
        success: true,
        message: "Specialization fetched successfully",
        data: specialization,
      });
});

//Update specialization
export const updateSpecialization = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { specilization_name, program_id, course_id } = req.body;

  if (!specilization_name && !program_id && !course_id) {
    throw new ApiError(400, "At least one field is required to update");
  }

  const updatedSpecialization = await Specilization.findByIdAndUpdate(
    id,
    {
      $set: {
        specilization_name,
        program_id,
        course_id,
      },
    },
    { new: true }
  );

  if (!updatedSpecialization) {
    throw new ApiError(404, "Specialization not found");
  }

  res.status(200).json({
    success: true,
    message: "Specialization updated successfully",
    data: updatedSpecialization,
  });
});

//Delete specialization
export const deleteSpecialization = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedSpecialization = await Specilization.findByIdAndDelete(id);

  if (!deletedSpecialization) {
    throw new ApiError(404, "Specialization not found");
  }

  res.status(200).json({
    success: true,
    message: "Specialization deleted successfully",
    data: deletedSpecialization,
  });
  
});

