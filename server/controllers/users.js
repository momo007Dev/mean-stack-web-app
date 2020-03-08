const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const User = require("../models/users");

const user_signup = (req, res) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            //console.log(user + "toto");
            if (user.length >= 1) {
                return res
                    .status(409)
                    .json({
                    message: "Mail already exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res
                                    .status(201)
                                    .json({
                                    message: "User created successfully",
                                    user : {
                                        userId : result._id,
                                        userEmail : result.email,
                                        userPassword : result.password
                                    }
                                });
                            })
                            .catch(err => {
                                console.log(err.name);
                                res.status(500).json({
                                    error: err.message,
                                });
                            });
                    }
                });
            }
        });
};

const user_delete = (req, res) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "User deleted successfully"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

module.exports = {
    user_signup,
    user_delete
};
