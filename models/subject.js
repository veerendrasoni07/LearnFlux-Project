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


const subjectSchema = new mongoose.Schema({
    subjectName:{
        type:String,
        required:true
    },
    studentClass:{
        type:String,
        required:true
    },
    noteType:{
        type:String,
        enum:['Detailed Notes','Short Notes','Important Questions'],
        required:true
    },
    chapters:[pdfSchema]
});

const Subject = mongoose.model('Subject',subjectSchema);
module.exports = Subject;