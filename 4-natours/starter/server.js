const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', err => {
    console.log(err.name,err.message)
    console.log("UNCAUGHT EXCEĞTON")
    process.exit(1);
});

const app = require('./app');
console.log(process.env.DATABASE);

console.log('Current Working Directory:', process.cwd());
console.log('Database:', process.env.DATABASE);


if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
    console.error('DATABASE veya DATABASE_PASSWORD tanımlı değil.');

}

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(con => {
    console.log('DB connection successful!')
}).catch(err => console.log("Error connecting"));

//console.log(app.get('env'));
const port = 3000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on('unhandledRejection', err => {
    console.log(err.name,err.message)
    console.log("UNHANDLED REJECTION")
    server.close(() => {
        process.exit(1);
    });
});


