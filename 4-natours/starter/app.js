const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const app = express();


// 1 ) MIDDLEWARES
//console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
};


app.use(express.json());

app.use(express.static(`${__dirname}/public`));


// app.use((req,res,next) => {
//     console.log('Hello from the middleware');
//     next();
// });

app.use((req,res,next) => {
    req.requestTime = new Date().toISOString();
    next();

});

// app.get('/', (req, res) => {
//     res.status(200).json({message : 'Hello, World!',app : 'Natours'});
// });

// app.post('/', (req, res) => {
//     res.send('POST request received');
// });

// 2 ) Handlers



app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status : 'fail',
    //     message: `Can't find ${req.originalUrl} on this server!`
    // });

    // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    // err.status = 'fail';
    // err.statusCode = 404;

    next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);


// app.get('/api/v1/tours/',getAllTours);
// app.get('/api/v1/tours/:id',getTour);
// app.post('/api/v1/tours',createTour);
// app.patch('/api/v1/tours/:id',updateTour);
// app.delete('/api/v1/tours/:id',deleteTour);

// 3 ) ROUTES




// 4 ) START SERVER


module.exports = app;

