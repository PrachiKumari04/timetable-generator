import { Section } from "../models/section.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Add section
export const addSection = asyncHandler(async (req, res) => {
  const section = req.body;

  if (Array.isArray(section) || section.length === 0)
    throw new ApiError(400, "Section data is required and should be an array");

  section.forEach((element) => {
    if (!element.class_id) throw new ApiError(400, "Class id is required");
    if (!element.section_name)
      throw new ApiError(400, "Section name is required");
  });

  //filter unique data which is not in database
  const sectionNames = section.map((s) => s.section_name);
  const existingSections = await Section.find({
    section_name: { $in: sectionNames },
  });
  const existingSectionNames = existingSections.map((s) => s.section_name);
  const uniqueSections = section.filter(
    (s) => !existingSectionNames.includes(s.section_name),
  );

  //insert unique data
  if (uniqueSections.length === 0) {
    return res.status(200).json({
      success: true,
      message: "All sections already exist",
    });
  }

  const createdSections = await Section.insertMany(uniqueSections);
  console.log(createdSections);

  if (createdSections.length === 0)
    throw new ApiError(500, "Failed to add sections");

  return res.status(201).json({
    success: true,
    message: "Sections added successfully",
    data: createdSections,
  });
});

// Get all sections
export const getAllSections = asyncHandler(async (req, res) => {
  const sections = await Section.find().populate("class_id");

  if (!sections) {
    throw new ApiError(404, "No sections found");
  }

  return res.status(200).json({
    success: true,
    message: "Sections fetched successfully",
    data: sections,
  });
});

// Get section by ID
export const getSectionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new ApiError(400, "Section id is required");

  const section = await Section.findById(id).populate("class_id");

  if (!section) {
    throw new ApiError(404, "Section not found");
  }

  return res.status(200).json({
    success: true,
    message: "Section fetched successfully",
    data: section,
  });
});

// Update section
export const updateSection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { class_id, section_name, discraption } = req.body;

  if (!id) throw new ApiError(400, "Section id is required");

  if (!class_id && !section_name) {
    throw new ApiError(400, "At least one field is required to update");
  }

  const updatedSection = await Section.findByIdAndUpdate(
    id,
    {
      $set: {
        class_id,
        section_name,
        discraption,
      },
    },
    { new: true },
  );

  if (!updatedSection) {
    throw new ApiError(404, "Section not found");
  }

  return res.status(200).json({
    success: true,
    message: "Section updated successfully",
    data: updatedSection,
  });
});

// Delete section
export const deleteSection = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new ApiError(400, "Section id is required");

  const deletedSection = await Section.findByIdAndDelete(id);

  if (!deletedSection) {
    throw new ApiError(404, "Section not found");
  }

  return res
    .status(200)
    .json({
      success: true,
      message: "Section deleted successfully",
      data: deletedSection,
    });
});
