const express = require('express');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { extractDetails } = require('./components/Extract-details');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3001;
const IDCard = require('./models/IDcard');
const bodyParser = require('body-parser');
const { timeStamp } = require('console');

// const vision = new Vision({ keyFilename: '[PATH_TO_JSON_KEY_FILE]' });

// Middleware
// app.use(express.json()); // Automatically parses JSON in the request body
app.use(cors()); // Enable CORS for all routes
mongoose.connect("mongodb+srv://manan19badaya6:4veb3bqzfqZBXzy7@detail-extraction.hogp1fu.mongodb.net/")
app.use(bodyParser.json());
const upload = multer({dest:path.join(__dirname, 'uploads')});



// Vision API endpoint
app.post('/Extract-text',upload.single('image'), async (req, res) => {

  
    const client = new ImageAnnotatorClient({
        keyFilename:'credential.json',
    })
   

  try {
    
    
    
    const absolutePath = path.resolve(req.file.path);
    const binaryImageData = fs.readFileSync(absolutePath);
    const base64ImageData = Buffer.from(binaryImageData).toString('base64');
    const [result] = await client.textDetection({
      image: {
        content: base64ImageData,
      },
      imageContext: {
        languageHints: ['en'], // Set the language hint to English and Numbers
      },
    });
    // const [result] = await client.textDetection(absolutePath);
   
   
    // console.log(req.file.path);
    const detections = result.textAnnotations;
    const data = await extractDetails(detections[0]);
    const currentTimestamp = new Date();
    const options = { timeZone: 'Asia/Kolkata' }; // 'Asia/Kolkata' is the timezone for IST

    const istDateTime = currentTimestamp.toLocaleString('en-IN', options);
    data.timeStamp = istDateTime;
    const newIDcard = IDCard(data);
      newIDcard.save()
    .then(doc => {
      console.log(doc);
    })
    .catch(error => {
      console.error(error);
    });
    res.json(data);
  } catch (error) {
    console.error('Error analyzing image:', error);
    const currentTimestamp = new Date();
    const options = { timeZone: 'Asia/Kolkata' }; // 'Asia/Kolkata' is the timezone for IST

    const istDateTime = currentTimestamp.toLocaleString('en-IN', options);
    
    const newIDcard = IDCard({
      error:"error occurred while analyzing the image",
      timeStamp: istDateTime,
      success: false
    })
    newIDcard.save()
    .then(doc => {
      console.log(doc);
    })
    .catch(error => {
      console.error(error);
    });
    res.status(500).json({ error: 'An error occurred while analyzing the image.' });
  }
});

app.get("/getData", async (req, res) => {
  try {
    const data = await IDCard.find({});
    res.json({data});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/updateData",async(req,res)=>{
   const Updateddata = req.body;
  try {
    const result = await IDCard.findByIdAndUpdate(
      Updateddata._id,
      Updateddata,
      { new: true }
    );
  
    if (result) {
      console.log("Update successful:", result);
    } else {
      console.log("Document not found or update did not occur.");
    }
  } catch (error) {
    console.error("Error during update:", error.message);
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
