const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './../config.env' });

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
});






//console.log(app.get('env'));
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});