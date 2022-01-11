const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    college: String,
    batch: String,
    status: Boolean,
    dsa: Number,
    web: Number,
    react: Number,
}, {
    timestamps: true,
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;