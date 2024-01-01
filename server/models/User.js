const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    houseNumber: { type: String },
    street: { type: String },
    city: { type: String },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
