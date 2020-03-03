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
});
