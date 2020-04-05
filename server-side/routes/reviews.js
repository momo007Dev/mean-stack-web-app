const express  = require("express");
const passport = require("passport");

const router = express.Router();

const ctrlReviews = require("../controllers/reviews");
const ctrlUsers = require("../controllers/users");


router
    .route('/user/:userId/reviews')
    .post(ctrlReviews.reviewsCreate);

router.get("/reviews/all", ctrlUsers.users_get_all);

router
    .route('/user/:userEmail/reviews/:reviewId')
    .patch(ctrlReviews.reviewsUpdateOne)
    .delete(ctrlReviews.reviewsDeleteOne);

module.exports = router;
