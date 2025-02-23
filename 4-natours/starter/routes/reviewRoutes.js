const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router();


router
    .route('/:id')
    .get(reviewController.getReview)
    .delete(authController.protect,
        authController.restrictTo('admin','lead-guide'),
        reviewController.deleteReview)

router
    .route('/')
    .get(authController.protect,
        reviewController.getAllReviews)
    .post(authController.protect,
        authController.restrictTo('admin','lead-guide'),
        reviewController.createReview);


module.exports = router;