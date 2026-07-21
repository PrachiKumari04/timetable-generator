import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/timetable";
    await mongoose.connect(mongoUri);
    const db = mongoose.connection.db;

    const allUsers = await db.collection("users").find({}).toArray();
    console.log(`Total users in DB before cleanup: ${allUsers.length}`);

    const seenUserIds = new Map();
    const toDelete = [];

    for (const u of allUsers) {
      if (seenUserIds.has(u.user_id)) {
        // Keep the record that has non-null student_id/faculty_id or newer
        const prev = seenUserIds.get(u.user_id);
        if (u.student_id || u.faculty_id) {
          toDelete.push(prev._id);
          seenUserIds.set(u.user_id, u);
        } else {
          toDelete.push(u._id);
        }
      } else {
        seenUserIds.set(u.user_id, u);
      }
    }

    if (toDelete.length > 0) {
      const res = await db.collection("users").deleteMany({ _id: { $in: toDelete } });
      console.log(`Deleted ${res.deletedCount} duplicate user records.`);
    } else {
      console.log("No duplicate user records found.");
    }

    const remaining = await db.collection("users").countDocuments();
    console.log(`Total users in DB after cleanup: ${remaining}`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
