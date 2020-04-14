const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const User = require("../models/users");

const user_signup = (req, res) => {

    if (!req.body.email || !req.body.password || !req.body.username) {
        return res
            .status(400)
            .json({
                success: false,
                message: "All fields required"
            });
    }

    User.find({
        $or: [
            {email: req.body.email}, {username: req.body.username}
        ]
    })
        .exec()
        .then(user => {
            console.log(user);
            if (user.length >= 1) {
                return res
                    .status(409)
                    .json({
                        success: false,
                        message: "Mail or Username already exists !"
                    });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            username: req.body.username,
                            email: req.body.email,
                            password: hash,
                            role: req.body.role || "student"
                        });
                        user
                            .save()
                            .then(result => {
                                res
                                    .status(201)
                                    .json({
                                        success: true,
                                        message: "User created successfully",
                                        user: {
                                            userId: result._id,
                                            username: result.username,
                                            userEmail: result.email,
                                            role: result.role,
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

    const {pseudo} = req.body;
    if (!pseudo || !req.body.password) {
        return res
            .status(400)
            .json({message: "All fields required"});
    }

    User.findOne({
        $or: [
            {email: pseudo}, {username: pseudo}
        ]
    })
        .exec()
        .then(user => {
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
                    console.log(user.role);
                    return res.status(401).json({
                        success: false,
                        message: "Auth failed !"
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
                                username: user.username,
                                userEmail: user.email,
                                role: user.role,
                                score: user.score
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
                message: "User deleted successfully !"
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
    const userInfo = ["username", "email", "password", "level", "role", "reviews"];
    const reqBodyLength = Object.keys(req.body).length;
    const checkValues = Object.keys(req.body).filter(x => (userInfo.includes(x))).length;

    if ((Object.keys(req.body).length > 7) || (reqBodyLength !== checkValues)) {
        return res
            .status(405)
            .json({
                message: "Some fields are NOT allowed"
            });
    }

    if (userId === process.env.ADMIN_ID && req.user.role !== 'admin') {
        return res
            .status(403)
            .json({
                message: "Can NOT update admin's info !!!"
            });
    }

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(400).json({
                message: "password field is required !"
            });
        }
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

const update_user_score = (req, res) => {
    const {userId} = req.params;
    console.log(req.user);

    if ((Number(req.body.score) > 10)) {
        return res
            .status(405)
            .json({
                message: "The max score is 10"
            });
    }

    const userScore =
        {"score": req.body.score, "level": getLevel(req.user, req.body.score)};
    User.updateOne({_id: userId}, {$set: userScore})
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
};

const get_user_by_id = (req, res) => {
    const {userId} = req.params;
    User.findById(userId)
        .select("_id email role username level password")
        .exec()
        .then(doc => {
            if (doc) {
                console.log(doc);
                res
                    .status(200)
                    .json({
                        user: {
                            userId: doc._id,
                            email: doc.email,
                            username: doc.username,
                            role: doc.role,
                            level: doc.level,
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


function getLevel(user, score) {
    if (score <= 0 || score < 2) {
        return this.user = "A1"
    } else if (score <= 2 || score < 4) {
        return this.user = "A2"
    } else if (score <= 4 || score < 6) {
        return this.user = "B1"
    } else if (score <= 6 || score < 8) {
        return this.user = "B2"
    } else if (score <= 8 || score <= 9) {
        return this.user = "C1"
    } else {
        return this.user = "C2"
    }
}


module.exports = {
    user_signup, user_delete, user_login,
    users_get_all, get_user_by_id, update_user, update_user_score
};
