const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

// API SECRET : E7TpMGWu4jef-V1wXCTEV_TSidU
// API KEY : 474639746683441
// CLOUD NAME : dktwuay7l

cloudinary.config({
    cloud_name: 'dktwuay7l',
    api_key: '474639746683441',
    api_secret: 'E7TpMGWu4jef-V1wXCTEV_TSidU'
})


const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder_name:'learnMate-pdfs',
        resource_type:'raw',
        allowedFormats :['pdf']
    }
});

module.exports = {cloudinary,storage};