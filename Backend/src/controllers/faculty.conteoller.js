import { Faculty } from "../models/faculty.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//  Register new faculty
export const registerFaculty = asyncHandler(async (req, res) => {
  // gata data froem frontend

  const faculties = req.body;
  console.log("Body -->", req.body);

  //now validate data
  if (!Array.isArray(faculties) || faculties.length === 0) {
    throw new ApiError(400, "Faculty data is required and must be an array");
  }

  //validate each field
  faculties.forEach((faculty) => {
    if (!faculty.faculty_id) {
      throw new ApiError(400, "Faculty ID is required");
    }
    if (!faculty.faculty_name) {
      throw new ApiError(400, "Faculty Name is required");
    }
    if (!faculty.email) {
      throw new ApiError(400, "Email is required");
    }
    if (!faculty.phone) {
      throw new ApiError(400, "Phone is required");
    }
    if (!faculty.specialization) {
      throw new ApiError(400, "Specialization is required");
    }
    if (!faculty.higher_education) {
      throw new ApiError(400, "Higher Education is required");
    }
    if (!faculty.years_of_Experience) {
      throw new ApiError(400, "Years of Experience is required");
    }
    if (!faculty.gender) {
      throw new ApiError(400, "Gender is required");
    }
    if (!faculty.date_of_joining) {
      throw new ApiError(400, "Date of Joining is required");
    }
    if (!faculty.date_of_birth) {
      throw new ApiError(400, "Date of Birth is required");
    }
    if (!faculty.address) {
      throw new ApiError(400, "Address is required");
    }
  });

  //filter out unique records from given data
  const facultyIds = faculties.map((faculty) => faculty.faculty_id);
  const emails = faculties.map((faculty) => faculty.email);
  const phones = faculties.map((faculty) => faculty.phone);

  const existingFaculties = await Faculty.find({
    $or: [
      { faculty_id: { $in: facultyIds } },
      { email: { $in: emails } },
      { phone: { $in: phones } },
    ],
  });
  const existingFacultyIds = new Set(
    existingFaculties.map((f) => f.faculty_id),
  );
  const existingEmails = new Set(existingFaculties.map((f) => f.email));
  const existingPhones = new Set(existingFaculties.map((f) => f.phone));

  const uniqueFacultyRecords = faculties.filter(
    (faculty) =>
      !existingFacultyIds.has(faculty.faculty_id) &&
      !existingEmails.has(faculty.email) &&
      !existingPhones.has(faculty.phone),
  );

  console.log("Unique Faculty Records -->", uniqueFacultyRecords);
  if (uniqueFacultyRecords.length === 0) {
    throw new ApiError(
      408,
      "All provided faculties already exist in the database",
    );
  }

  //save in database
  const facultyRecords = await Faculty.insertMany(uniqueFacultyRecords, {
    ordered: false,
  });
  if (facultyRecords.length === 0) {
    throw new ApiError(500, "Failed to register faculties");
  }

  console.log("Faculty -->", facultyRecords);

  res
    .status(201)
    .json(
      new ApiResponse(201, "Faculty registered successfully", facultyRecords),
    );
});

// Get all Faculty
export const getAllFaculties = asyncHandler(async (req, res) => {
  const faculties = await Faculty.find();

  if (!faculties || faculties.length === 0) {
    throw new ApiError(404, "No faculties found");
  }

  console.table("Faculties -->", faculties);

  res
    .status(200)
    .json(new ApiResponse(200, "Faculties fetched successfully", faculties));
});

// Get faculty by ID
export const getFacultyById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log("Faculty Id -->", id);

  if (!id) {
    throw new ApiError(404, "Faculty Id is not found in Url");
  }

  const faculty = await Faculty.findById(id);

  console.log("Faculty -->", faculty);

  if (!faculty) {
    throw new ApiError(404, "Faculty not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Faculty fetched successfully", faculty));
});

// Update faculty
export const updateFaculty = asyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log("Faculty Id -->", id);

  if (!id) {
    throw new ApiError(404, "Faculty Id is not found in Url");
  }

  const faculty = await Faculty.findById(id);
  console.log("Faculty -->", faculty);

  if (!faculty) {
    throw new ApiError(404, "Faculty is not found");
  }

  if (!req.body) {
    throw new ApiError(404, "Faculty data is not found in body");
  }

  const {
    faculty_name,
    email,
    phone,
    specialization,
    higher_education,
    years_of_Experience,
    gender,
    date_of_joining,
    date_of_birth,
    address,
    isActive,
  } = req.body;

  console.log("Body -->", req.body);

  const updatedFaculty = await Faculty.findByIdAndUpdate(
    id,
    {
      faculty_name,
      email,
      phone,
      specialization,
      higher_education,
      years_of_Experience,
      gender,
      date_of_joining,
      date_of_birth,
      address,
      isActive,
    },
    { new: true },
  );

  console.log("Updated Faculty -->", updatedFaculty);

  if (!updatedFaculty) {
    throw new ApiError(404, "Faculty not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Faculty updated successfully", updatedFaculty));
});

// Delete faculty
export const deleteFaculty = asyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log("Faculty ID -->", id);

  if (!id) {
    throw new ApiError(404, "Faculty Id is not found in Url");
  }

  const faculty = await Faculty.findByIdAndDelete(id);

  if (!faculty) {
    throw new ApiError(404, "Faculty not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Faculty deleted successfully", faculty));
});
