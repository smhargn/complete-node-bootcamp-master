
const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {

    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message,400);
};

const handleDuplicateFieldsDB = err => {

    console.log("Duplicate Key Error Yakalandı!");
    console.log(err.message);

    // RegEx: { name: "Tour Name" } kısmındaki sadece değeri yakalar
    const match = err.message.match(/dup key: \{ name: "([^"]+)" \}/);

    if (match) {
        const tourName = match[1]; // Sadece içindeki değeri al
        console.log(tourName); // Çıktıyı temiz gör
        return new AppError(`Duplicate tour name: ${tourName}`, 400);
    }

    // Eğer regex yakalayamazsa, genel hata mesajı döndür
    return new AppError("Duplicate tour name found.", 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message)

    const message = `Invalid Validation Error: ${errors.join(', ')}`;
    return new AppError(message, 400);
};

const handleJsonWebTokenError = () => { 
    return new AppError('Invalid token. Please log in again!', 401);
}

const handleTokenExpiredError = () => {
    return new AppError('Your token has expired! Please log in again.', 401);
}



const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status : err.status,
        error : err,            
        message: err.message,
        stack : err.stack
    });
};
const sendErrorProd = (err, res) => {
    if(err.isOperational){
        res.status(err.statusCode).json({
            status : err.status,     
            message: err.message,
        });
    }else {
        // 1 Log Error
        console.error('ERROR',err); 
        

        // 2 Send generic error message
        res.status(500).json({
            status : 'error',
            message: 'Something went wrong, please try again later.',
        })
    }


}

module.exports = (err,req,res,next) => {
    //console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.statusCode = err.statusCode || 'error'

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, res);
    }else if (process.env.NODE_ENV === 'production'){

        let error = Object.create(err);

        console.log("Error name  : "+error.name)
        console.log("Error message : "+error.code)

        if(error.name === 'CastError') error = handleCastErrorDB(error)
        if(error.code === 11000) error = handleDuplicateFieldsDB(error)
        if(error.name === 'ValidationError') error = handleValidationErrorDB(error)
        if(error.name === 'JsonWebTokenError') error = handleJsonWebTokenError()
        if(error.name === 'TokenExpiredError') error = handleTokenExpiredError()

        sendErrorProd(error, res);
    }



};