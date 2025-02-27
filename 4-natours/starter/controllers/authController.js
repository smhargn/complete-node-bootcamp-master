const {promisify} = require('util');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');


const signToken = id => {
    return jwt.sign({id},process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
}

const createSendToken = (user,statusCode,res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        //secure : true,
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt',token)

    // remove from output
    user.password = undefined;

    res.status(statusCode).json({
        status:'success',
        token,
        data:{
            user:user
        }
    });
};

exports.signup = catchAsync (async (req,res,next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        role : req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    createSendToken(newUser,201,res);


});

exports.login = catchAsync (async (req, res, next) => {
    const {email,password} = req.body;

    // 1) Check email pass exists
    if(!email || !password) {
        return next(new AppError('Please enter valid mail and password',400));
    }


    // 2 ) User exists && password corretc
    const user = await User.findOne({email}).select('+password');



    if(!user || !(await user.correctPassword(password,user.password))) {
        return next(new AppError('Invalid email or password',401));
    }


    // 3) Everything ok send token to client
    createSendToken(user,200,res);
});

exports.protect = catchAsync(async (req,res,next) => {
    let token;
    // 1 ) Getting token and check it's there
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    console.log(token)
    console.log(process.env.JWT_SECRET)

    if(!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2 ) Validate token
    const decoded = await promisify(jwt.verify) (token, process.env.JWT_SECRET);
    console.log("Decod Ediliyor :")
    console.log(decoded);


    // 3 ) Check if user still exists
    const currentUser = await User.findById(decoded.id);

    if(!currentUser) {
        return next(new AppError('User no longer exists.', 401));
    }

    // 4 ) Check if user changed password after the token was issued
    // console.log("Selamet . "+currentUser.changedPasswordAfter(decoded.iat));
   if(await currentUser.changedPasswordAfter(decoded.iat)) {
    console.log("False girdi")
    return next(new AppError('User recently changed password! Please log in again.', 401));
     
   };


   // Grant Access
    req.user = currentUser;
    next();
    
});

// Only for rendered pages,no errors!
exports.isLoggedIn = catchAsync(async (req,res,next) => {

    if (req.cookies.jwt) {
        // Verify Token
        const decoded = await promisify(jwt.verify) (req.cookies.jwt, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.id);

        if(!currentUser) {
            return next();
        }

        if(await currentUser.changedPasswordAfter(decoded.iat)) {
            return next();
            
        };

        // there is a logged in
        res.locals.user = currentUser;
        next();
    }else {
        next();
    }
    
});

exports.restrictTo = (...roles) => {
    return (req,res,next) => {
        // roles ['admin','lead-guide']

        if (!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    }
    
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1 ) Get user based on POSTED Mail
    const user = await User.findOne({ email : req.body.email });

    if (!user){
        return next(new AppError('No user found with that email.', 404));
    }
    // 2 ) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave : false});
    // await user.save();


    // 3 ) Send to mail
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Please click on the following link to reset your password: \n${resetURL}\nIf you did not make this request, please ignore this email.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token (valid for 10 min)',
            message
        });

        res.status(200).json({
                status:'success',
                message: 'Token sent to email!'
        });

    } catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave : false});

        return next(new AppError('There was an error sending the email. Try again later!', 500));

    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) get user based on the token
    const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

    const user = await User.findOne({
        passwordResetToken : hashedToken,
        passwordResetExpires : {$gt : Date.now()}
    });

    // 2 ) If token not expired , and there is user , set new passs
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    
    await user.save();

    // 3 ) update changedpasswordat property
    //user.passwordChangedAt = Date.now;


    // 4 ) Log the user in , send JWT

    createSendToken(user,200,res);

});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1 ) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2 ) Check if posted current password is correct
    if(!(await user.correctPassword(req.body.passwordCurrent,user.password))){
        return next(new AppError('Current password cannot be the same as new password.', 400));
    }

    // 3 ) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();
    

    // 4 ) Log user in,
    createSendToken(user,201,res);
});