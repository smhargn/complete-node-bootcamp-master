const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const Review = require('./../../models/reviewModel');

dotenv.config({ path: './../config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('✅ DB connection successful!');
        if (process.argv[2] === '--import') {
            importReviews();
        } else if (process.argv[2] === '--delete') {
            deleteData();
        }
    })
    .catch(err => console.error('❌ DB connection error:', err));

// READ
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// IMPORT REVIEWS INTO DB
const importReviews = async () => {
    try {
        await Review.create(reviews);
        console.log('✅ Data successfully loaded!');
    } catch (err) {
        console.error('❌ Error while loading data:', err);
    }
    process.exit();
};

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('✅ Data successfully loaded!');
    } catch (err) {
        console.error('❌ Error while loading data:', err);
    }
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        const result = await Tour.deleteMany({});
        console.log('✅ Data successfully deleted!', result);
    } catch (err) {
        console.error('❌ Error while deleting data:', err);
    }
    process.exit();
};
