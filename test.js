const mongoose = require('mongoose');
const { Schema } = mongoose;

// 1. Base User Schema
// The 'discriminatorKey' is what Mongoose uses to tell the types apart.
const baseOptions = {
  discriminatorKey: 'userType', 
  collection: 'users',
};

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String
}, baseOptions);

const User = mongoose.model('User', userSchema);

// 2. Student Schema (Extends User)
const Student = User.discriminator('Student', new Schema({
  studentId: { type: String, required: true, unique: true },
  major: String,
  year: Number
}));

// 3. Faculty Schema (Extends User)
const Faculty = User.discriminator('Faculty', new Schema({
  facultyId: { type: String, required: true, unique: true },
  department: String,
  designation: String
}));

module.exports = { User, Student, Faculty };