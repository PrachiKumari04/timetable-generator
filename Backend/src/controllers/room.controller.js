import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Room } from "../models/room.models.js";

const createRoom = asyncHandler(async (req, res) => {
    const room = await Room.create(req.body);
    return res.status(201).json(new ApiResponse(201, room, "Room created successfully"));
});

const getRooms = asyncHandler(async (req, res) => {
    const rooms = await Room.find();
    return res.status(200).json(new ApiResponse(200, rooms, "Rooms retrieved successfully"));
});

const getRoomById = asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.id);
    if (!room) throw new ApiError(404, "Room not found");
    return res.status(200).json(new ApiResponse(200, room, "Room retrieved successfully"));
});

export { createRoom, getRooms, getRoomById };
