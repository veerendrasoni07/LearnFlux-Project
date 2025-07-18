const e = require('express');
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true
    },
    profilePicture:{
        type:String,
        required:false
    },
    stream:{
        type:String,
        default:'None'
    },
    studentClass:{
        type:String,
        required:false,
    },
    board:{
        type:String,
        required:false,
        enum: ['CBSE', 'ICSE', 'MP BOARD', 'OTHER'],
    },
    university:{
        type:String,
        required:false,
    },
    interest:{
        type:String,
        required:false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate:{
            validator:(value)=>{
                const result = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return result.test(value);
            }
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    state: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },



});

const User =  mongoose.model('User',userSchema);
module.exports = User;