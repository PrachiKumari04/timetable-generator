import {Schema,model  } from "mongoose";

const sectionSchema = new Schema({
    section_id:{
        type:String,
        required:true,
        unique:true,
        uppercase:true,
        trim:true
    },
    section_name:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    class_id:{
        type:Schema.Types.ObjectId,
        ref:"Class"
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

export const Section = model("Section",sectionSchema)