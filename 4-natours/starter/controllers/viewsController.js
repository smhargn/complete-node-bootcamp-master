const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

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
