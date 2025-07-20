
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Import the database connection
const geminiRouter = require('./routes/gemini_chat'); // Import the Gemini chat routes
const app = express();
const cors = require('cors');   
const authRouter = require('./routes/auth_route'); // Import the authentication routes
const pdfRouter = require('./routes/pdf_route'); // Import the PDF routes
const otpRouter = require('./routes/otp_route');
const scrapePdfs = require('./routes/scrape_pdfs');
require('dotenv').config();
const port = process.env.PORT || 3000;
app.use(bodyParser.json()); // Middleware to parse JSON bodies
app.use(cors());

app.use(authRouter); // Use the authentication routes
app.use(geminiRouter); // Use the Gemini chat routes
app.use(pdfRouter); // Use the PDF routes
app.use(otpRouter); // Use the otp routes
app.use(scrapePdfs); // Use the ScrapePdfs
// Start the server

app.get("/api/test", (req, res) => {
  res.send("API is working on Railway!");
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

