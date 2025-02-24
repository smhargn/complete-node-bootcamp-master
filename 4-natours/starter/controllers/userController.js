
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/handlerFactory');

const filterObj = (obj,...allowedFields) => {
    const newObj = {};

    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });

    return newObj;

};

// exports.getAllUsers = catchAsync (async (req,res) => {
//     const users = await User.find();

//     // SEND RESPONSE

//     res.status(200).json({
//         status:'success',
//         results:users.length,
//         data:{
//             users
//         }
//     });
// });

exports.getAllUsers = factory.getAll(User);

exports.getMe = (req,res,next) => {
    req.params.id = req.user.id;
    next();
};

exports.updateMe = catchAsync (async (req,res,next) => {
    // 1) Create error if user POSTSs password data
    if(req.body.password || req.body.passwordConfirm){
        return next(
                    new AppError(
                        'This route is not for password updates. Please use /updateMyPassword.',
                        400
                    )
                );
    };


    // 2 ) Update user document
    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id,filteredBody,{new : true,runValidators:true});
    
    //user.name = req.body.name;

    //await User.save();

    res.status(200).json({
        status : 'success',
        data : {
            user : updatedUser
        }
    })
});



exports.deleteMe = catchAsync (async (req,res,next) => {
    await User.findByIdAndUpdate(req.user.id,{active : false})

    res.status(204).json({
            status :'success',
            data : null
        })

});

exports.createUser = (req,res) => {
    res.status(500).json({
        status :'error',
        message :'Use /signup to create a new user'
    });
};

exports.getUser = factory.getOne(User);

// Dont update pass with this

exports.updateUser = factory.updateOne(User);


exports.deleteUser = factory.deleteOne(User);

// exports.deleteUser = (req,res) => {
//     res.status(500).json({
//         status :'error',
//         message :'Server Error'
//     });
// };