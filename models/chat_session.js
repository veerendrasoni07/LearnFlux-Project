const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    role:{
        type:String,
        enum:['user','model'],
        required:true
    },
    text:{
        type:String,
        required:true
    },
    
},{Timestamp:true,});


const chatSessionSchema = new mongoose.Schema({
    sessionId:{
        type:String,
        required:true,
        unique:true
    },
    title:{
        type:String,
        default:'New Chat'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    userId:{
        type:String,
        required:true
    },
    history:[chatMessageSchema],
},{Timestamp:true}
)

const ChatSession = mongoose.model('ChatSession',chatSessionSchema);
module.exports = ChatSession;