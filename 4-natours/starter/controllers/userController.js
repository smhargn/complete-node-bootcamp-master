
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllUsers = catchAsync (async (req,res) => {
    const users = await User.find();

    // SEND RESPONSE

    res.status(200).json({
        status:'success',
        results:users.length,
        data:{
            users
        }
    });
});

exports.createUser = (req,res) => {
    res.status(500).json({
        status :'error',
        message :'Server Error'
    });
};

exports.getUser = (req,res) => {
    res.status(500).json({
        status :'error',
        message :'Server Error'
    });
};

exports.updateUser = (req,res) => {
    res.status(500).json({
        status :'error',
        message :'Server Error'
    });
};

exports.deleteUser = (req,res) => {
    res.status(500).json({
        status :'error',
        message :'Server Error'
    });
};