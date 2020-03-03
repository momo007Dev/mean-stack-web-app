const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

// User Schema

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        require: true
    },
    email: {
        type: String,
        unique: true,
        index: true,
        require: true
    },
    username: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    contact: {
        type: String,
        require: true
    },
});

UserSchema.plugin(uniqueValidator);

const User = module.exports = mongoose.model('User', UserSchema);
