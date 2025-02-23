const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams : true });


router
    .route('/:id')
    .get(reviewController.getReview)
    .delete(authController.protect,
        authController.restrictTo('admin','lead-guide'),
        reviewController.deleteReview)
    .patch(reviewController.updateReview);

router
    .route('/')
    .get(authController.protect,
        reviewController.getAllReviews)
    .post(authController.protect,
        authController.restrictTo('admin','lead-guide','user'),
        reviewController.setTourUserIds,
        reviewController.createReview);

module.exports = router;