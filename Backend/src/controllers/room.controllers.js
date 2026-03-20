import { Room } from "../models/room.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Add rooms
export const addRoom = asyncHandler(async (req, res) => {
  //recieve data form clint in array of object
  const room = req.body;
  if (!Array.isArray(room) || room.length === 0)
    throw new ApiError(400, "Room data is required and must be an array");

  room.forEach((room) => {
    if (!room.room_no) throw new ApiError(400, "Room number is required");
    if (!room.floor_no) throw new ApiError(400, "Floor number is required");
    if (!room.wings) throw new ApiError(400, "Wing is required");
  });

  //find unique records
  const roomNos = room.map((r) => r.room_no);
  const uniqueRoomNos = [...new Set(roomNos)];

  if (uniqueRoomNos.length !== roomNos.length) {
    throw new ApiError(400, "Duplicate room numbers found in the input");
  }

  // Check if any room already exists in the database
  const existingRooms = await Room.find({
    room_no: { $in: uniqueRoomNos },
  });

  if (existingRooms.length > 0) {
    const existingRoomNos = existingRooms.map((r) => r.room_no);
    throw new ApiError(
      400,
      `Rooms already exist: ${existingRoomNos.join(", ")}`,
    );
  }

  // Insert rooms into the database
  const createdRooms = await Room.insertMany(room);

  res
    .status(201)
    .json(new ApiResponse(201, createdRooms, "Rooms added successfully"));
});

//get all rooms
export const getAllRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find();

  if (!rooms || rooms.length === 0) {
    throw new ApiError(404, "No rooms found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, rooms, "Rooms fetched successfully"));
});

//get room by id
export const getRoomById = asyncHandler(async (req, res) => {
  const room = req.params;

  if (!room.id) {
    throw new ApiError(400, "Room id is required");
  }

  const roomById = await Room.findById(room.id);

  if (!roomById) {
    throw new ApiError(404, "Room not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, roomById, "Room fetched successfully"));
});

//update room by id
export const updateRoomById = asyncHandler(async (req, res) => {
  const room = req.body;
  const id = req.params.id;

  if (!room) {
    throw new ApiError(400, "Room data is required");
  }

  if (!id) {
    throw new ApiError(400, "Room id is required");
  }

  const updatedRoom = await Room.findByIdAndUpdate(
    id,
    {
      $set: {
        room_no: room.room_no,
        floor_no: room.floor_no,
        wings: room.wings,
      },
    },
    { new: true, runValidators: true }
  );

  if (!updatedRoom) {
    throw new ApiError(404, "Room not found or update failed");
  }


  res
    .status(200)
    .json(new ApiResponse(200, updatedRoom, "Room updated successfully"));
});

//delete room
export const deleteRoomById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    throw new ApiError(400, "Room id is required");
  }

  const deletedRoom = await Room.findByIdAndDelete(id);

  if (!deletedRoom) {
    throw new ApiError(404, "Room not found or delete failed");
  }

  res
    .status(200)
    .json(new ApiResponse(200, deletedRoom, "Room deleted successfully"));
})
