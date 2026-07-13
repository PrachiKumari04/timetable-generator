import mongoose from "mongoose";

const run = async () => {
    try {
        await mongoose.connect("mongodb+srv://REMOVED_CREDENTIALS@timetable.u4ag3ve.mongodb.net/timetable");
        
        const courses = await mongoose.connection.db.collection("courses").find({}).toArray();
        
        const searchTerms = ["ADBMS", "DAA", "OS", "APTITUDE", "JAVA", "WEB", "WT", "AFM", "DATA SCIENCE", "CLOUD", "ETHICAL", "LINUX", "LOGICAL", "ACCOUNT", "OPERATING"];
        courses.forEach(c => {
            if (searchTerms.some(s => c.course_name.toUpperCase().includes(s))) {
                console.log(`${c.course_id}: ${c.course_name}`);
            }
        });

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
