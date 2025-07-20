const mongoose = require('mongoose');

const cachedResult = new mongoose.Schema({
    query:{
        type:String,
        required:true
    },
    pdflinks:{
        type:[String]
    }
});


const CachedResult = mongoose.model("CachedResult",cachedResult);

module.exports = CachedResult;