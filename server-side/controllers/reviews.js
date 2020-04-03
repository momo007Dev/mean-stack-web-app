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
            author: user.email,
            rating,
            reviewText,
            CreatedOn: new Date()
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


const reviewsUpdateOne = (req, res) => {

    const {userId, reviewId} = req.params;
    if (!userId || !reviewId) {
        return res
            .status(404)
            .json({message: 'The question id and review id are both required'});
    }

    User.findById(userId)
        .select('reviews')
        .exec()
        .then(user => {
            if (!user)
                return res
                    .status(404)
                    .json({message: 'No user was found with provided ID'});

            if (user.reviews && user.reviews.length > 0) {
                const thisReview = user.reviews.id(reviewId);
                if (!user.reviews.id(reviewId)) {
                    return res
                        .status(404)
                        .json({message: 'No was review found with provided ID'});
                } else {

                    if (Object.keys(req.body).length > 2) {
                        return res
                            .status(405)
                            .json({
                                message: "Some fields are NOT allowed !"
                            });
                    }

                    thisReview.rating = req.body.rating;
                    thisReview.reviewText = req.body.reviewText;
                    user
                        .save()
                        .then(result => {
                            if (!result)
                                return res
                                    .status(404)
                                    .json({message: "No review was found"});
                            res
                                .status(200)
                                .json({message: "Review updated successfully"});
                        })
                        .catch(err => {
                            res.status(500).json({
                                success: false,
                                error: err.message,
                            });
                        });
                }
            } else {
                res
                    .status(404)
                    .json({message: 'No Review to update'});
            }
        })
        .catch(err => {
            res
                .status(500)
                .json({
                    success: false,
                    error: err.message
                });
        });

};

const reviewsDeleteOne = (req, res) => {

    const {userId, reviewId} = req.params;
    if (!userId || !reviewId) {
        return res
            .status(404)
            .json({message: 'The question id and review id are both required'});
    }

    User.findById(userId)
        .select('reviews')
        .exec()
        .then(user => {
            if (!user) // !user is nul here and if it's not null we got a user
                return res
                    .status(404)
                    .json({message: 'No user was found with provided ID'});

            if (user.reviews && user.reviews.length > 0) {
                if (!user.reviews.id(reviewId)) {
                    return res
                        .status(404)
                        .json({message: 'No was review found with provided ID'});
                } else {
                    user.reviews.id(reviewId).remove();
                    user.save(err => {
                        ;
                        if (err) { // err is null here
                            return res
                                .status(500)
                                .json(err);
                        } else {
                            res
                                .status(200)
                                .json({message: "Review deleted successfully !"});
                        }
                    });
                }
            } else {
                res
                    .status(404)
                    .json({message: 'No Review to delete'});
            }
        })
        .catch(err => {
            res
                .status(500)
                .json({
                    success: false,
                    error: err.message
                });
        });
};

module.exports = {
    reviewsCreate, reviewsDeleteOne, reviewsUpdateOne
};
