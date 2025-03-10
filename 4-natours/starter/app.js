const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1 ) MIDDLEWARES
//console.log(process.env.NODE_ENV);
app.use(express.static(path.join(__dirname, 'public')));
// Set security HTTP headers
// app.use(helmet());

// app.use(helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       styleSrc: ["'self'", "https://fonts.googleapis.com", "https://api.mapbox.com"],
//       scriptSrc: ["'self'", "https://js.stripe.com", "https://unpkg.com", "https://api.mapbox.com"],
//       frameSrc: ["'self'", "https://js.stripe.com"],
//       workerSrc: ["'self'"],
//       connectSrc: ["'self'", "ws://127.0.0.1:52039"],
//     }
// }));

  


if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
};

// limit logins same api

const limiter = rateLimit({
    max: 20,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api',limiter);


app.use(express.json({ limit : '10kb'}));
app.use(express.urlencoded({extended : true,limit: '10kb'}));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitazation against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: [
            'duration',
            'ratingsQuantity',
            'maxGroupSize',
            'minAge',
            'difficulty',
            'price',
            'ratingAverage',
            'duration',
            'maxDistance'
        ]
     
}));

app.use(compression());


//app.use(express.static(`${__dirname}/public`));



// app.use((req,res,next) => {
//     console.log('Hello from the middleware');
//     next();
// });

app.use((req,res,next) => {
    req.requestTime = new Date().toISOString();
    //console.log(req.headers);
    next();

});



// app.get('/', (req, res) => {
//     res.status(200).json({message : 'Hello, World!',app : 'Natours'});
// });

// app.post('/', (req, res) => {
//     res.send('POST request received');
// });

// 2 ) Handlers


app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

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