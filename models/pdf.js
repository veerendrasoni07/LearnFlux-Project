const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
    studentClass:{
        type:String,
        required:true,
    },
    subject:{
        type:String,
        required:true
    },
    chapter:{
        type:String,
        required:true
    },
    pdf:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const Pdf = mongoose.model('Pdf',pdfSchema);
module.exports = Pdf;



