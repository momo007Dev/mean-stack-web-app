const User = require("../models/users");

const getAuthor = (req, res, callback) => {
    const {userId} = req.params;
    User.findById(userId)
        .select("_id email password")
        .exec()
        .then(doc => {
            if (doc) {
                callback(req, res);
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

const doAddReview = (req, res, user) => {
    if (!user) {
        res
            .status(404)
            .json({message: "User not found"});
    } else {
        const {rating, reviewText} = req.body;
        user.reviews.push({
            author : user.email,
            rating,
            reviewText,
            CreatedOn : new Date()
        });
        user
            .save()
            .then(review => {
                res
                    .status(201)
                    .json(review);
            }).catch(err => {
            res
                .status(500)
                .json({
                success: false,
                error: err.message,
            });
        });
    }
};

const reviewsCreate = (req, res) => {
    getAuthor(req, res,
        (req, res) => {
            const userId = req.params.userId;
            User.findById(userId)
                .exec()
                .then(user => {
                    if (!user) {
                        res
                            .status(400)
                            .json({
                                message: " No user found"
                            });
                    } else {
                        doAddReview(req, res, user);
                    }
                })
                .catch(err => {
                    res
                        .status(500)
                        .json({
                        success: false,
                        error: err.message,
                    });
                });
        });
};


module.exports = {
    reviewsCreate
};
