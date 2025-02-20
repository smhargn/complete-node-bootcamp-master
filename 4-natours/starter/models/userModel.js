const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');



const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Please enter your name']
    },
    email : {
        type : String,
        required : [true, 'Please enter your email address'],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail]
    },
    photo : {
        type : String,
        default : 'default.jpg'
    },
    password : {
        type : String,
        required : [true, 'Please enter your password'],
        minlength : [8, 'Password must be at least 8 characters long'],
        select : false
    },
    passwordConfirm : {
        type : String,
        required : [true, 'Please confirm your password'],
        validate : {
            validator : function(el) {
                return el === this.password
            },
            message : 'Passwords do not match'
        }
    }




})

userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash password
    this.password = await bcrypt.hash(this.password,12);

    this.passwordConfirm = undefined;
    next();


})

userSchema.methods.correctPassword = async function(candidatePassword,userPassword) {
    return await bcrypt.compare(candidatePassword,userPassword);
};

const User = mongoose.model('User',userSchema);



module.exports = User;

