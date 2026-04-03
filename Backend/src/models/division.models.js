import { Schema, model } from "mongoose";

const divisionSchema = new Schema({
  
  division_id: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },

  division_name: {
    type: String,
    required: true,
    uppercase: true,
  },

  description: {
    type: String,
    trim: true,
  },

},{timestamps:true});

export const Division = model("Division", divisionSchema);
