const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

// Reviews Schema
const reviewSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    reviewText: {
        type: String,
        required: true
    },
    CreatedOn: {
        type: String
    }
});

// Users Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: 'student',
        enum: ["student", "teacher", "admin"]
    },
    reviews: [reviewSchema]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
