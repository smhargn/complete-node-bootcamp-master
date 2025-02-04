const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
                required: [true, 'Tour name is required'],
                unique: true,
                trim: true,
                maxlength: [40, 'Tour name must have less or equal then 40 characters'],
                minlength: [10, 'Tour name must have more or equal then 10 characters']
                // validate: [validator.isAlpha,'Tour name must only contain characters']
    },
    slug : String
    ,
    duration: {
        type: Number,
                required: [true, 'Tour durations are required']
    }
    ,
    maxGroupSize: {
        type: Number,
                required: [true, 'Max group size is required']
    },
    difficulty: {
        type: String,
        required: [true, 'Difficulty is required'],
        enum :{ 
            values : ['easy','medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
    },
        lowercase: true
    },
    ratingsQuantity: {
        type: Number,
        default: 0

    },
    ratingsAverage: {
        type: Number,
        default: 4,
        min: 1,
        max: 5,
        required: [true, 'Rating is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    priceDiscount: {
        type: Number,
        validate: { 
            validator : function(val) {
                // this only points to current doc on NEW document creation
                return val < this.price; // 100 < 200
            },
            message: 'Discount price ({VALUE}) should be below regular price'
        },
        
    }, 
    summary: {
        type: String,
        trim: true,
    },
    description : {
        type: String,
        trim: true,
        required: [false, 'Description is required']
    },
    imageCover: {
        type: String,
        required: [true, 'Image cover is required']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
    
},{
    toJSON: {virtuals : true},
    toObject: {virtuals : true}
}

);

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before.save() and.create()
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();

});

// tourSchema.pre('save', function(next) {
//     console.log('Will save document...');
//     next();
// });

// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// });

tourSchema.pre(/^find/, function(next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function(docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    console.log(docs);
    next();
});


// AGGREGATIN MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    console.log(this.pipeline());
    next();

});


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;