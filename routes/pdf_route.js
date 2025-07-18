const express = require('express');

const pdfRouter = express.Router();
const multer = require('multer');
const {uploadPdf,getAllPdfs} = require('../controller/pdf_controller');
const {storage} = require('../config/cloudinary'); // this is the cloudinary storage configuration for multer
const Subject = require('../models/subject');
const upload = multer({storage});

pdfRouter.post('/api/pdf/upload',upload.single('pdf'),uploadPdf); // single is used to upload a single file, pdf is the name of the file input in the form

// pdfRouter.get('/api/fetch-pdfs',getAllPdfs); // this will fetch all the pdfs

// api routes for fetching notes accoding to notes type : [Detailed Notes,Short Notes,Important Questions]
pdfRouter.get('/api/notes/',async(req,res)=>{
    try{
        const {noteType,studentClass} = req.query;
        const filter = {}
        if(noteType) filter.noteType = noteType;
        if(studentClass) filter.studentClass = studentClass;
        const notes = await Subject.find(filter);
        res.status(200).json(notes);
    }catch(e){
        console.log(e);
        res.status(500).json({error:"Internal Server Error"});
    }
});

module.exports = pdfRouter;
