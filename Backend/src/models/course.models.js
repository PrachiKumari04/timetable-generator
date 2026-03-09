import { Schema, model } from "mongoose";


const courseSchema = new Schema({
    course_id:{
        type:String,
        required:true,
        unique:true,
        uppercase:true,
        trim:true
    },
    course_name:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    course_duration:{
        type:Number,
        required:true,
        trim:true
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

export const Course = model("Course",courseSchema)