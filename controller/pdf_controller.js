
const pdf = require('../models/pdf');
const Subject = require('../models/subject');

// for uploading the pdf file

const uploadPdf = async (req,res)=>{
    try {
        const {studentClass,subject,chapter,noteType} = req.body;
        const pdfFile = req.file // uploaded by user , populated by multer
        
        if(!pdfFile){
            return res.status(500).json({msg:"Pdf is not Provided!"});
        }
        const newPdf = new pdf({
            studentClass,
            subject,
            chapter,
            pdf:pdfFile.path
        });
        // check existing subject or not : if subject exist then add pdf of specific chapter into it.
        let subjectDoc = await Subject.findOne({
            subjectName:subject,
            studentClass : studentClass,
            noteType:noteType
        });

        if(!subjectDoc){
            // if we don't have the subject then create the subject and insert the pdf of specific chapter
            subjectDoc = new Subject({
                subjectName:subject,
                studentClass:studentClass,
                noteType:noteType,
                chapters:[newPdf]
            })
        }
        // if subject already exist then add the pdf of specific chapter.
        else{
            subjectDoc.chapters.push(newPdf);
        }
        // save the Subject 
        await subjectDoc.save();

        res.status(200).json({pdf:newPdf});


    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal Server Error"});
    }
}

// for fetching all the pdfs

const getAllPdfs = async(req,res)=>{
    try {
        const {studentClass} =req.query;  // waht is request query : it is the query parameters in the url, like ?studentClass=10&subject=maths
        let filter = {};
        if(studentClass) filter.studentClass = studentClass; // here we are checking if studentClass is present in the query parameters, if yes then we are adding it to the filter object where the key is studentClass and value is the studentClass from the query parameters
        const subjects = await Subject.find(filter);
        res.status(200).json(subjects);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal Server Error"});
    }
}



// fetch all chapters of particular subject


module.exports = {uploadPdf,getAllPdfs};