const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

// Users Schema
const UserSchema = new mongoose.Schema({
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

const Users = mongoose.model('user', UserSchema, 'users');

// Find the user by id
const getUserById = (id, callback) => {
    Users.findById(id, callback);
};

// Find the user by username
const getUserByUsername = (username, callback) => {
    const query = {
        username: username
    };
    Users.findOne(query, callback);
};

// register the user
const addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.log(err);
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

// compare passwords
const comparePassword = (password, hash, callback) => {
    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) console.log(err);
        callback(null, isMatch);
    });
};

module.exports = {
    getUserById,
    getUserByUsername,
    addUser,
    comparePassword,
    Users
};
