const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
//const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./../routes/reviewRoutes');


const router = express.Router();

//router.param('id', tourController.checkID);

// POST /tour/23123/reviews
// GET /tour/23123/reviews
// GET /tour/23123/reviews/234234

// router.route('/:tourId/reviews')
//     .post(authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//     );

router.use('/:tourId/reviews',reviewRouter)


// Create a checkBody middleware
// Chech if body contains name and price

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);



router
    .route('/')
    .get(authController.protect,tourController.getAllTours)
    .post(tourController.createTour);



router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(authController.protect,
        authController.restrictTo('admin','lead-guide'),
        tourController.deleteTour);


// POST /tour/23123/reviews
// GET /tour/23123/reviews
// GET /tour/23123/reviews/234234

// router.route('/:tourId/reviews')
//     .post(authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//     );

module.exports = router;