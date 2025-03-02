const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverview =  catchAsync(async(req, res) => {
    console.log("Over Selam")
    // 1 ) Get tour data from collection
    const tours = await Tour.find();

    // 2 ) Build template

    // 3 ) Render that template using tour data from 1)

    res.status(200).render('overview', {
        title : 'All Tours',
        tours
    });
});

exports.getTour = catchAsync(async (req, res,next) => {

    const { slug } = req.params;
    const tour = await Tour.findOne({slug}).populate(
        {
            path: 'reviews',
            fields:'review rating user'
        }
    )

    if(!tour) {
        return next(new AppError('Tour not found with that name', 404));
    }
    // 1) Get the data, for the request tour
    //const tour = Tour.findOne(req.params.tour.slug)
    // 2) Build template
    // 3 ) Render template using data from 1
    res.status(200).render('tour', {
        title : tour.title,
        tour
    });
});

exports.getLoginForm = (req,res) => {
    
    res.status(200).render('login',{
        title: 'Login to account'
    });
}

exports.getAccount = (req, res) => {
    res.status(200).render('account',{
        title: 'Your Account'
    });
}

exports.updateUserData = catchAsync(async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {

        name: req.body.name,
        email: req.body.email

    },{
        new: true,
        runValidators: true
    });

    res.status(200).render('account',{
        title: 'Your Account',
        user:updatedUser
    });

});

// exports.updateUserPassword = catchAsync(async (req,res) => {
//     const updatedUser = await User.findByIdAndUpdate(req.user.id, {

//         passwordCurrent : req.body.password-current,
//         password : req.body.password,
//         passwordConfirm : req.body.password-confirm

//     },{
//         new: true,
//         runValidators: true
//     });

//     res.status(200).render('account',{
//         title: 'Your Account',
//         user:updatedUser
//     });


// })