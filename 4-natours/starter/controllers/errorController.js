

module.exports = (err,req,res,next) => {
    console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.statusCode = err.statusCode || 'error'


    res.status(err.statusCode).json({
        status : 'fail',
        message: err.message,
    });
};