
// Import the Google GenAI SDK
const { GoogleGenerativeAI  } = require("@google/generative-ai");
const express = require("express");
const geminiRouter = express.Router();
const ChatSession = require('../models/chat_session');
const genAI = new GoogleGenerativeAI ('AIzaSyBQRZ9eh82vhuovr4JEznMpQCJ5qAzZt24');
const {v4:uuidv4} = require('uuid');

const RoadMap = require('../models/roadmap');   


// Function to get or create a chat session
const getOrCreateChatSession = async (sessionId, userId) => {
    let session = await ChatSession.findOne({ sessionId });

    if (!session) {
        session = new ChatSession({
            sessionId,
            history: [],
            title: 'New Chat',
            userId
        });
        await session.save();
    }

    return session;
};



// create a new chat session
geminiRouter.post('/api/session',async(req,res)=>{
    try {
        const session = new ChatSession({
            sessionId: uuidv4(),
            history:[],
            title: req.body.title || 'New Chat',
            userId:req.body.userId
        });
    
        await session.save();
        res.status(200).json(session);
    } catch (error) {
        console.error("Error creating chat session:", error);
        res.status(500).json({error:"An error occurred while creating the chat session."});
    }
});


// creating api for fetching all the sessions
geminiRouter.get('/api/sessions/:userId',async(req,res)=>{
    try {
        const {userId} = req.params;
        const sessions = await ChatSession.find({userId},"sessionId title createdAt updatedAt").sort({createdAt:-1});
        res.status(200).json(sessions);
    } catch (error) {
        console.error("Error fetching chat sessions:", error);
        res.status(500).json({error:"An error occurred while fetching chat sessions."});    
    }
});


// creating api for deleting a session
geminiRouter.delete('/api/session/delete/:sessionId',async(req,res)=>{
    try {
        const {sessionId} = req.params;
        const session = await ChatSession.findOneAndDelete({sessionId});
        if(!session){
            return res.status(404).json({error:"Session not found."});
        }
        res.status(200).json({msg:"Session deleted Successfully."})
    } catch (error) {
        console.error("Error deleting chat session:", error);     
        res.status(500).json({error:"An error occurred while deleting the chat session."});
    }
})

// creating api for chat history
geminiRouter.get('/api/history/:sessionId',async(req,res)=>{
    try {
        const {sessionId} = req.params;
        const session = await ChatSession.findOne({sessionId});
        if(!session){
            return res.status(404).json({error:"Session not found."});
        }
        res.status(200).json({history:session.history});
    } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({error:"An error occurred while fetching chat history."});
    }
});


// creating api for concept explanation
geminiRouter.post('/api/explain',async(req,res)=>{
    try {
        const {sessionId,question,userId} = req.body;
        if(!sessionId || !question){
            return res.status(400).json({error:"Missing sessionId or question."});
        }
        const session = await getOrCreateChatSession(sessionId,userId);
        const model = genAI.getGenerativeModel({model:'gemini-2.5-flash'});
        const chat = model.startChat({
      history: session.history.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      })),
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 1024,
      },
    });

const prompt = `
You are LearnMate, a friendly and intelligent AI study assistant. Only respond to academic-related queries (like school subjects, exams, study tips, concept explanations, etc.). If the user asks a non-academic question, politely decline and redirect them to study.
When explaining, be clear and beginner-friendly. Break down complex topics using simple language, step-by-step logic, bullet points, and relevant examples. Your goal is to help students truly understand and stay focused.
Always prioritize clarity, accuracy, and educational value. Avoid unnecessary fluff.
Now answer this question clearly and helpfully:
${question}
`;

        const result = await chat.sendMessage(prompt);
        const response =result.response;
        const responseText = response?.text?.().trim();
        if (!responseText) {
            return res.status(500).json({ error: "AI returned an empty or invalid response." });
        }
        session.history.push({role:'user',text:question});
        session.history.push({role:'model',text:responseText});
        await session.save();
        res.status(200).json({result:response.text()});

    } catch (error) {
        console.error("Error during explanation:", error);
        res.status(500).json({error:"An error occurred while generating the explanation."});
    }
})



// creating api for roadmap generation
geminiRouter.post('/api/roadmap/:userId',async(req,res)=>{
    try {
        const {userId} = req.params;
        const {goal,timelimit,problem} = req.body;
        if(!goal || !timelimit || !problem){
            return res.status(400).json({error:"Missing goal, timelimit, resource or problem."});
        }

        const model = genAI.getGenerativeModel({model:'gemini-2.5-flash'});
        const prompt = `You are an expert career advisor,learning planner and mentor named CareerMate. Your job is to create personalized learning roadmaps.
                        Only respond to educational topics. If user asks something off-topic, politely say:
                        "I'm here to help with academic learning only."

                        Create a roadmap for the following goal:
                        Goal: ${goal}
                        Time Limit: ${timelimit}
                        Problem: ${problem}

                        Format the roadmap as follows:
                        1. Step-by-step plan
                        2. Recommended resources
                        3. Estimated time for each step
                        4. Tips for success`;

        const result = await model.generateContent(prompt);
        
        const resultResponse = result.response;
        const roadmap = new RoadMap({
            userId,
            goal,
            timelimit,
            problem,
            roadmap:resultResponse.text()
        });
        const roadmapResponse = await roadmap.save();
        console.log("Roadmap generated and saved:", roadmap);
        res.status(200).json(roadmapResponse);
    } catch (error) {
        console.error("Error during roadmap generation:", error);
        res.status(500).json({error:"An error occurred while generating the roadmap."});
    }
});


// creating api for fetching all roadmaps
geminiRouter.get('/api/roadmaps/:userId',async(req,res)=>{
    try {
        const {userId} =req.params;
        const roadmaps = await RoadMap.find({userId});
        res.status(200).json(roadmaps);
    } catch (error) {
        console.error("Error fetching roadmaps:", error);
        res.status(500).json({error:"An error occurred while fetching roadmaps."});
    }
})


// api for deleting a roadmap
geminiRouter.delete('/api/delete/roadmap/:userId',async(req,res)=>{
    try {
        const {userId} = req.params;
        const deleteRoadmap = await RoadMap.findOneAndDelete({userId});
        res.status(200).json({msg:"Roadmap deleted successfully."});
    } catch (error) {
        console.error("Error deleting roadmap:", error);
        res.status(500).json({error:"An error occurred while deleting the roadmap."});
    }
})


// api for updating the name of chat 

geminiRouter.put('/api/update-chat-name',async(req,res)=>{
    try{
        const {newName,sessionId} = req.query;
        const updated = await ChatSession.findByIdAndUpdate(
            sessionId,
            {
                title:newName
            },
            {new:true}
        )

        res.status(200).json(updated);
 
    }catch(e){
        console.log(e);
        res.status(500).json({e:"Internal Server Error"});
    }
})



/*geminiRouter.post('/api/generate',async(req,res)=>{
    try {
        const prompt = req.body.question;
        const result = await generateResponse(prompt);
        res.json({ result: result });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({error:"An error occurred while generating the response."});
    }
})*/



module.exports = geminiRouter;