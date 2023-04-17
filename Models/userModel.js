const mongoose = require('mongoose')
const { isEmail } = require('validator')
const userSchema = new mongoose.Schema({

    pseudo: {
        type: String,
        minLength: 3,
        maxLength: 55,
        unique: true,
        trimp: true
    },
    email: {
        type: String,
        required: true,
        validate: [isEmail],
        lowercase: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        minlength: 6
    },
    isAdmin:{
        type:Boolean,
        default:false
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('user', userSchema);