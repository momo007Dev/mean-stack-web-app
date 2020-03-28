const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const User = require("../models/users");

const user_signup = (req, res) => {

    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({
                success: false,
                message: "All fields required"
            });
    }

    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res
                    .status(409)
                    .json({
                        success: false,
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
                                // console.log(result);
                                res
                                    .status(201)
                                    .json({
                                        success: true,
                                        message: "User created successfully",
                                        user: {
                                            userId: result._id,
                                            userEmail: result.email,
                                            userPassword: result.password
                                        }
                                    });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    success: false,
                                    error: err.message,
                                });
                            });
                    }
                });
            }
        }).catch(err => {
        res.status(500).json({
            success: false,
            error: err.message,
        });
    });
};

const user_login = (req, res) => {

    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({message: "All fields required"});
    }

    User.findOne({email: req.body.email})
        .exec()
        .then(user => {
            //console.log(user);
            if (!user) {
                return res
                    .status(401)
                    .json({
                        success: false,
                        message: "Auth failed !"
                    });
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        success: false,
                        message: "Auth failed"
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user.email,
                            userId: user._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res
                        .status(200)
                        .json({
                            success: true,
                            message: "Auth successful",
                            token: "JWT " + token,
                            user: {
                                userId: user._id,
                                userEmail: user.email
                            }
                        });
                }
                res.status(401).json({
                    success: false,
                    message: "Auth failed"
                });
            });
        })
        .catch(err => {
            res
                .status(500)
                .json({
                    success: false,
                    error: err
                });
        });
};

const user_delete = (req, res) => {
    User.deleteOne({_id: req.params.userId})
        .exec()
        .then(result => {
            if (result.n === 0) {
                return res
                    .status(404)
                    .json({message: "No user found for the provided ID"});
            }
            res.status(200).json({
                message: "User deleted successfully"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
};

const users_get_all = (req, res) => {
    User.find()
        .select("-__v")
        .exec()
        .then(users => {
            if (users.length === 0)
                return res
                    .status(204)
                    .json({message: "No Users found in the database"});
            res.status(200).json(users);
        })
        .catch(err => {
            res
                .status(500)
                .json({
                    errorMessage: err.message,
                    errorName: err.name
                });
        });
};

const update_user = (req, res) => {
    const {userId} = req.params;

    if (Object.keys(req.body).length > 2) {
        return res
            .status(405)
            .json({
                message: "Some fields are NOT allowed"
            });
    }

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err)
            return res.status(400).json({
                message : "password field is required",
                error: err
            });
        req.body.password = hash;
        User.updateOne({_id: userId}, {$set: req.body})
            .exec()
            .then(result => {
                if (result.n === 0) {
                    return res
                        .status(404)
                        .json({message: "No valid entry found for provided ID"});
                } else {
                    res.status(200).json({
                        message: "User info updated successfully",
                        modifiedDocs: result.nModified,
                        request: {
                            type: "GET",
                            url: `http://localhost:5000/api/user/${userId}`
                        }
                    });
                }
            }).catch(err => {
            res
                .status(500)
                .json({
                    errorMessage: err.message,
                    errorName: err.name
                });
        });
    });
};

const get_user_by_id = (req, res) => {
    const {userId} = req.params;
    User.findById(userId)
        .select("_id email password")
        .exec()
        .then(doc => {
            if (doc) {
                console.log(req.isAuthenticated());
                res
                    .status(200)
                    .json({
                        user: {
                            userId: doc._id,
                            email: doc.email,
                            password: doc.password
                        },
                        request: {
                            type: "GET",
                            url: `http://localhost:5000/api/user/${doc._id}`
                        }
                    });
            } else {
                res
                    .status(404)
                    .json({message: "No valid entry found for provided ID"});
            }
        })
        .catch(err => {
            res
                .status(500)
                .json({
                    errorMessage: err.message,
                    errorName: err.name
                });
        });
};

module.exports = {
    user_signup,
    user_delete,
    user_login,
    users_get_all,
    get_user_by_id,
    update_user
};
