//const fs = require('fs');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.aliasTopTours = (req,res,next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};




// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
// );

// exports.checkID = (req, res, next, val) => {
//     console.log(`Tour ID: ${val}`);
//     if(req.params.id * 1 > tours.length) return res.status(404).json({status:'fail', message:'Invalid ID'});
//     next();
// };

// exports.checkBody = (req, res, next) => {
//     if (!req.body.name ||!req.body.price) return res.status(400).json({status:'fail', message:'Missing name or price'});
//     next();
// };

exports.getAllTours = catchAsync(async (req,res,next) => {

        // BUILD QUERY

        //console.log(req.query, queryObj);

        // const tours = await Tour.find({
        //     duration : 5,
        //     difficulty: 'easy',
        
        // });

        // const tours = await Tour.find()
        //     .where('duration')
        //     .equals(5)
        //     .where('difficulty')
        //     .equals('easy');

        // 2 = Advanced Filtering



        // 3 ) Sort
        // if(req.query.sort){
        //     query = query.sort(req.query.sort.split(',').join(' '));
        //     // sort('price ratingsAverage')
        // }else {
        //     query = query.sort('-createdAt');
        // }

        // 4 ) Field Limiting

        // if(req.query.fields) {
        //     const fields = req.query.fields.split(',').join(' ');
        //     query = query.select(fields);

        // } else {
        //     query = query.select('-__v');
        // }

        // 5 ) Pagination




        //EXECUTE QUERY

        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
        const tours = await features.query;

        // SEND RESPONSE

        res.status(200).json({
            status:'success',
            results:tours.length,
            data:{
                tours: tours
            }
        });
    



});

exports.getTour = catchAsync(async (req,res,next) => {

        const tour = await Tour.findById(req.params.id);
        // Tour.findOne({ _id: req.params.id })

        if(!tour) {
            return next(new AppError('Tour not found with that id',404));
        }

        res.status(200).json({
            status : 'success',
            data:{
                tour
            }
        });




    // const tour = tours.find(tour => tour.id === id);

    // res.status(200).json({
    //     status:'success',
    //     data:{
    //         tour
    //     }
    // });
});



exports.createTour = catchAsync(async (req,res,next) => {
    
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status :'success',
        data :{
            tour : newTour
        }
    });
    
    //const newTour = new Tour({});
    //newTour.save()


    // const newId = tours[tours.length - 1].id + 1;
    // const newTour = Object.assign({id: newId}, req.body);
    // tours.push(newTour);

    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours), err => {

    // });

});

exports.updateTour = catchAsync(async (req,res,next) => {


        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {new: true,runValidators: true});

        if(!tour) {
            return next(new AppError('Tour not found with that id',404));
        }

        res.status(200).json({
            status: 'success',
            data : {
                tour: tour
    
            }
        });




});

exports.deleteTour = catchAsync(async (req,res,next) => {


        const tour = await Tour.findByIdAndDelete(req.params.id);

        if(!tour) {
            return next(new AppError('Tour not found with that id',404));
        }

        res.status(204).json({
            status: 'success',
            data : null
    
        });




});

exports.getTourStats = catchAsync(async (req,res) => {

        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group : {
                    _id: { $toUpper: '$difficulty'} ,
                    numTours: { $sum : 1 },
                    numRating : { $sum : '$ratingsQuantity' },
                    avgRating: { $avg : '$ratingsAverage' },
                    avgPrice: { $avg : '$price' },
                    minPrice: { $min : '$price' },
                    maxPrice: { $max : '$price' }
                }
            },
            {
                $sort : { avgPrice: 1 }
            },
            // {
            //     $match : { _id: { $ne : 'EASY'} }
            // }
        ])

        res.status(200).json({
            status: 'success',
            data : {
                stats
    
            }
        });

  
});

exports.getMonthlyPlan = catchAsync(async (req,res) => {

        const year = req.params.year * 1; // 2021
        const plan = await Tour.aggregate([
            {
                $unwind : '$startDates'
            },
            {
                $match : {
                    startDates : {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },{
                $group : {
                    _id : { $month: '$startDates' },
                    numTourStarts : { $sum: 1 },
                    tours : { $push: '$name' }
                }
            },
            {
                $addFields : { month : '$_id' }
            },
            {
                $project : {
                    _id : 0,
                }
            },
            {
                $sort : { numTourStarts: -1 }
            },
            {
                $limit : 12
            }
        ]);

        res.status(200).json({
            status: 'success',
            data : {
                plan
    
            }
        });
                    
 

});