import { Specialization } from "../models/specialization.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Add specialization
export const addSpecialization = asyncHandler(async (req, res) => {
  const specialization = req.body;

  if (!Array.isArray(specialization) || specialization.length === 0)
    throw new ApiError(400, "Specialization data is required");

  //validate
  specialization.forEach((s) => {
    if (!s.specialization_id)
      throw new ApiError(400, "Specialization ID is required");
    if (!s.specialization_name)
      throw new ApiError(400, "Specialization name is required");
  });

  //find unique records which is not  stored in db
  const specIds = specialization.map((s) => s.specialization_id);
  const existingSpecs = await Specialization.find({
    specialization_id: { $in: specIds }
  });
  const existingSpecIds = new Set(existingSpecs.map((s) => s.specialization_id));

  const uniqueSpecialization = specialization.filter(
    (s) => !existingSpecIds.has(s.specialization_id)
  );

  console.log(uniqueSpecialization)


  if (uniqueSpecialization.length === 0)
    throw new ApiError(400, "All Specialization already exists");

  const createdSpecialization = await Specialization.insertMany(uniqueSpecialization);

  if (createdSpecialization.length === 0) throw new ApiError(400, "Something went wrong");


  res.status(200).json({
    success: true,
    message: "Specialization added successfully",
    data: createdSpecialization,
  });
});

//Get all specialization
export const getAllSpecialization = asyncHandler(async (req, res) => {

  const specialization = await Specialization.find();

  if (specialization.length === 0) throw new ApiError(404, "No specialization found");

  res.status(200).json({
    success: true,
    message: "Specialization fetched successfully",
    data: specialization,
  });
});

//Get specialization by id
export const getSpecializationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const specialization = await Specialization.findById(id);
  if (!specialization) throw new ApiError(404, "No specialization found");

  res.status(200).json({
    success: true,
    message: "Specialization fetched successfully",
    data: specialization,
  });
});

//Update specialization
export const updateSpecialization = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { specialization_id, specialization_name, isActive } = req.body;

  if (!specialization_id && !specialization_name && isActive === undefined) {
    throw new ApiError(400, "At least one field is required to update");
  }

  const updatedSpecialization = await Specialization.findByIdAndUpdate(
    id,
    {
      $set: {
        specialization_id,
        specialization_name,
        isActive,
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

  const deletedSpecialization = await Specialization.findByIdAndDelete(id);

  if (!deletedSpecialization) {
    throw new ApiError(404, "Specialization not found");
  }

  res.status(200).json({
    success: true,
    message: "Specialization deleted successfully",
    data: deletedSpecialization,
  });

});

