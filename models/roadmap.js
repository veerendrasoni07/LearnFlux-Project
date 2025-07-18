const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    goal:{
        type:String,
        required:true
    },
    timelimit:{
        type:String,
        required:true
    },
    problem:{
        type:String,
        required:true
    },
    roadmap:{
        type:String,
        required:true
    }
});

const Roadmap = mongoose.model('Roadmap',roadmapSchema);
module.exports = Roadmap;