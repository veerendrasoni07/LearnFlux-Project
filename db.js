const mongoose = require('mongoose');

const MONGOURL = 'mongodb://mongo:XrkilsbNvrOdkrLXjluTmnRVkeeORAdY@mainline.proxy.rlwy.net:39449';
mongoose.connect(MONGOURL);

const db = mongoose.connection;

db.on('connected',()=>{
    console.log('MongoDB connected successfully');
})

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

module.exports = db;
