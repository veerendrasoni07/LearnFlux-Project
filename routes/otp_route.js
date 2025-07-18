const express = require('express');
const crypto = require('crypto');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const Otp = require('../models/otp');
const otpRouter = express.Router();
const jwt = require('jsonwebtoken');

otpRouter.post('/api/send-otp',async(req,res)=>{
    try{
        const {email} = req.body;
        const userExist = await User.findOne({email});
        if(!userExist) return res.status(401).json({msg:"User with this email don't have any existing account!"});

        const otp = crypto.randomInt(100000,999999).toString();

        // save to the db directly , for saving directly to the db we are using .create() instead of .save() because we don't
        // have to manipulate the field , therefore whenever we are manipulating the field and saving after manipulating then
        // we use .save() and when we don't have to manipulate and directly want to save into the db then we use .create() , 
        // .create() method does the same task that the .save() does. 
        
        await Otp.create({
            'email':email,
            otp,
            expiresAt:Date.now() + 5*60*1000
        });

        const transpoter = nodemailer.createTransport({
            service :'gmail',
            auth: {user:"veerendrasoni0555@gmail.com",pass:"zcyb nsgj fnoa gywg"}
        });

        await transpoter.sendMail({
            from:"LearnFlux learnflux@sandbox2f44d44bcbf14656bd56a45c01ceb065.mailgun.org",
            to:email,
            subject:"You Otp Code",
            text:`You Otp is ${otp}. It expires in 5 minutes`
        });

        res.status(200).json({success:true,msg:"Otp Sent!"});

    }catch(e){
        console.log(e);
        res.status(500).json({success:false,e:"Internal Server Error"});
    }
});


otpRouter.post('/api/verify-otp',async(req,res)=>{
    try {
        const {otp,email} = req.body;
        const userExist = await User.findOne({email});
        if(!userExist) return res.status(401).json({msg:"User with this email don't have any existing account!"});
        const record = await Otp.findOne({email}).sort({createdAt:-1});
        if(!record) return res.status(400).json({success:false,msg:"Otp not found"});
        if(record.otp !== otp) return res.status(401).json({success:false,msg:"Invalid Otp!"});
        if(record.expiresAt < Date.now()) return res.status(401).json({success:false,msg:"Otp expired"});
        await Otp.deleteMany({email}); // clear all the old otps
        // generate token 
        const token = await jwt.sign({id:userExist._id},"passwordKey");
        res.status(200).json({token,user:userExist._doc});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal Server Error"});
    }
});


module.exports = otpRouter;

