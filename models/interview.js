const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    },
    company: String,
    profile: String,
    status: String,
    date: String,
});

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;