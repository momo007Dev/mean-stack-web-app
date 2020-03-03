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

// Find the user by id
module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
};

// Find the user by username
module.exports.getUserByUsername = (username, callback) => {
    const query = {
        username: username
    };
    User.findOne(query, callback);
};

// register the user
module.exports.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) return err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

// compare passwords
module.exports.comparePassword = (password, hash, callback) => {
    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};
