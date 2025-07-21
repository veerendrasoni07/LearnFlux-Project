const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const cachedResult = require('../models/pdfs_cached_results');
const scrapeRouter = express.Router();


// Step 1 : take query from the user.
// Step 2 : search the query in duckduckgo and scrape the full html page of given query
// Step 3 : use cheerio to extract parts(text,links,images) of the page using css selector 
// Step 4 : now parse it to find pdf links 
// Step 5 : return top 10 pdf links 



const fetchPdfLinks = async (query)=>{
    try {
        const url = `https://html.duckduckgo.com/html?q=${encodeURIComponent(query)}+filetype:pdf`; // url which is consisting query to get pdf
        const response = await axios.get(url,{
            headers : {
                "User-Agent":"Mozilla/5.0"
            }
        });  // sending request to fetch the html string.

        const $ = cheerio.load(response.data); // using the cheerio to parse the html page string to manipulate the data (for extracting the pdf links).

        const links = []; // to store the fetched links

         $("a").each((i, el) => {
            const href = $(el).attr("href");
            if (href) {
                // Relaxed filter to check if it likely points to a PDF
                if (href.includes(".pdf")) {
                    links.push(href);
                }
            }
        });

        return links.slice(0,10);

    } catch (error) {
        res.status(500).json({error:"Internal Server Error"});
        console.log(error);
        return [];
    }
}



scrapeRouter.get('/api/fetch-pdfs',async(req,res)=>{
    try {
        const {studentClass,subject,chapter} = req.query;
        if(!studentClass || !subject || !chapter){
            return res.status(404).json({msg:"Student Class OR Subject OR Chapter is missing"});
        }
        const query = `${studentClass} ${subject} ${chapter}`;
        const cached = await cachedResult.findOne({query});
        if(cached){
            console.log("pdf links are fetched from the cachedResults");
            return res.status(200).json(cached.pdflinks);
        }
        const links = await fetchPdfLinks(query);

        await cachedResult.create({
            'query':query,
            'pdflinks': links
        });    
        
        res.status(200).json(links);

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal Server Error"});
    }
});

module.exports = scrapeRouter;