const express = require('express');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { extractDetails } = require('./components/Extract-details');
const app = express();
const PORT = process.env.PORT || 3001;
// const vision = new Vision({ keyFilename: '[PATH_TO_JSON_KEY_FILE]' });

// Middleware
// app.use(express.json()); // Automatically parses JSON in the request body
app.use(cors()); // Enable CORS for all routes


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
    // console.log(RecognizedAttributes);
    res.json(data);
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ error: 'An error occurred while analyzing the image.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
