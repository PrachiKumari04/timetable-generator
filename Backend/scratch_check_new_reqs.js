import mongoose from "mongoose";

const run = async () => {
    try {
        await mongoose.connect("mongodb+srv://REMOVED_CREDENTIALS@timetable.u4ag3ve.mongodb.net/timetable");
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
