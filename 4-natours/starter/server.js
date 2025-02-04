const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
//console.log(process.env);

const DB = process.env.DATABASE.replace('<PASSWORD>>', process.env.DATABASE_PASSWORD);

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