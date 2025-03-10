const Review = require('./../models/reviewModel');
// const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/handlerFactory');


exports.getAllReviews = factory.getAll(Review);

// exports.getAllReviews = catchAsync( async function(req,res,next){
//     let filter = {}
//     if(req.params.tourId) filter = { tour : req.params.tourId};

//     const reviews = await Review.find(filter);

//     res.status(200).json({
//         status : 'success',
//         results : reviews.length,
//         data : {
//             reviews
//         }
//     })

// });

// exports.getReview = catchAsync( async function(req,res,next){
//     const review = await Review.findById(req.params.id);

//     if (!review) {
//         return next(new AppError('No review found with that ID', 404));
//     };

//     res.status(200).json({
//         status : 'success',
//         data : {
//             review
//         }
//     });

// });

exports.setTourUserIds = (req, res, next) => {
        // Allow nested routes
        if(!req.body.tour) req.body.tour = req.params.tourId;
        if(!req.body.user) req.body.user = req.user.id;
        next();
     
};

exports.getReview = factory.getOne(Review);

exports.createReview = factory.createOne(Review);

// exports.createReview = catchAsync ( async function(req,res,next){
//     // Allow nested routes
//     if(!req.body.tour) req.body.tour = req.params.tourId;
//     if(!req.body.user) req.body.user = req.user.id;
 
//     const newReview = await Review.create(req.body);

//     res.status(201).json({
//         status :'success',
//         data : {
//             review : newReview
//         }
//     });
// })

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review)

// exports.deleteReview = catchAsync ( async function(req,res,next){
//     const review = await Review.findByIdAndDelete(req.params.id);

//     if(!review){
//         return next(new AppError('No review found with that ID', 404));
//     }

//     res.status(204).json({
//         status :'success',
//         data : null
//     });
// });