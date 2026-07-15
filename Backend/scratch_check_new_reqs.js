import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/timetable";
        await mongoose.connect(uri);
        console.log("Connected to MongoDB!");

        const courses = await mongoose.connection.db.collection("courses").find({}).toArray();
        const faculties = await mongoose.connection.db.collection("faculties").find({}).toArray();

        const searchCourses = ["ADBMS", "DAA", "OS", "APTITUDE", "JAVA", "WT", "AFM", "DATA SCIENCE", "CLOUD", "ETHICAL", "LINUX"];
        console.log("--- Courses ---");
        courses.forEach(c => {
            if (searchCourses.some(s => c.course_name.includes(s) || c.course_id.includes(s))) {
                console.log(`${c.course_id}: ${c.course_name}`);
            }
        });

        const searchFaculties = ["VINOD", "SATYAM", "RAHUL", "PRADNYA", "HARSHIT"];
        console.log("--- Faculties ---");
        faculties.forEach(f => {
            if (searchFaculties.some(s => f.faculty_name.toUpperCase().includes(s))) {
                console.log(`${f.faculty_id}: ${f.faculty_name}`);
            }
        });

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
