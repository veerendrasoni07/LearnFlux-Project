const express = require("express");
const User = require("../models/user");
const authRouter = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

authRouter.post('/api/signup',async(req,res)=>{
    try {
        const {fullname,email,password } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({msg:"User with same email already exists!"});
        }
        const hashedPassword = await bcryptjs.hash(password,8);

        let newUser = new User({
            fullname,
            email,
            password: hashedPassword
        });
        const response = await newUser.save();
        res.status(200).json(response);
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({error:"An error occurred during signup."});
    }
})


// sign in or login
authRouter.post('/api/login',async(req,res)=>{
    try {
        const {email,password} = req.body;
        // Check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg:"User with this email does not exist!"});
        }
        // Check if password matches
        // Note: bcryptjs.compare returns a promise, so we use await
        const isMatch = await bcryptjs.compare(password,user.password);
        if(!isMatch){
            res.status(400).json({msg:"Incorrect password."});
        }
        // Generate JWT token
        // Note: jwt.sign takes a payload and a secret key, and returns a token
        const token = jwt.sign({id:user._id},"passwordKey");
        // Return the token and user data
        res.status(200).json({token,user:user._doc});

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({error:"An error occurred during login."});
    }
});




// route for updating user's board,class/university,interest

authRouter.put('/api/update/profile/:userId',async(req,res)=>{
    try {
        const {userId} =req.params;
        const {studentClass,interest,state,city,board} = req.body;
        const updatedProfile = await User.findByIdAndUpdate(userId,{
            studentClass,
            interest,
            state,
            city,
            board
        },
        {new:true});
        res.status(200).json(updatedProfile);
    } catch (error) {
        console.log("Error updating user profile:",error);
        res.status(500).json({error:"An error occuured while updating user profile."});
    }
});


// route for updating user's profile picture,and details

authRouter.put('/api/edit/profile/:userId',async(req,res)=>{
    try {
        const {userId} =req.params;
        const {fullname,state,city,board,studentClass,interest} = req.body;
        const updatedProfile = await User.findByIdAndUpdate(userId,{
            studentClass,
            fullname,
            interest,
            state,
            city,
            board,
        },
        {new:true});
        res.status(200).json(updatedProfile);
    } catch (error) {
        console.log("Error updating user profile:",error);
        res.status(500).json({error:"An error occuured while updating user profile."});
    }
});



// api for changing subject

authRouter.put('/api/change-class/:userId',async(req,res)=>{
    try{
        const {userId} = req.params;
        const {studentClass} = req.body;
        const updatedClass = await User.findByIdAndUpdate(userId,{
            studentClass
        });
        res.status(200).json(updatedClass);
    }
    catch(e){
        console.log(error);
        res.status(200).json({error:"Internal Server Error"});
    }
})


module.exports = authRouter;