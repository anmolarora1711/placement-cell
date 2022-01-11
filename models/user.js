const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
    },
    hash: String,
    salt: String,
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;