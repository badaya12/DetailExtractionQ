// const express = require('express');
// // import mongoose from "mongoose";

// const app = express();

// // import {  } from "@google-cloud/vision";
// const { ImageAnnotatorClient } = require('@google-cloud/vision');

// async function detectText(fileName) {
//   try {
//     const client = new ImageAnnotatorClient({
//         keyFilename:'credential.json',
//     });

//     // Read the image file into a Buffer
//     const [result] = await client.textDetection(fileName);
//     const detections = result.textAnnotations;

//     console.log('Text:');
//     detections.forEach((text) => console.log(text.description));

//     return detections;
//   } catch (error) {
//     console.error('An error occurred:', error);
//   }
// }

// const fileName = 't1.png';
// detectText(fileName);

// backend/server.js

const express = require('express');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;
// const vision = new Vision({ keyFilename: '[PATH_TO_JSON_KEY_FILE]' });

// Middleware
// app.use(express.json()); // Automatically parses JSON in the request body
app.use(cors()); // Enable CORS for all routes

// app.use('/uploads', express.static('uploads'));
const upload = multer({dest:path.join(__dirname, 'uploads')});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/uploads'); // Specify the directory where uploaded files will be stored
//   },
//   filename: function (req, file, cb) {
//     // Generate a unique filename
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   },
// });

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
    });
    // const [result] = await client.textDetection(absolutePath);
   
   
    console.log(req.file.path);
    const detections = result.textAnnotations;


    // const { filePath } = req.body; // Assuming you send the filePath from the frontend
    // const [result] = await vision.textDetection({ source: { filename: filePath } });
    // const detections = result.textAnnotations;
    console.log(detections);
    res.json({ detections });
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ error: 'An error occurred while analyzing the image.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
