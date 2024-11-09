const express = require('express');
const multer = require('multer');
const { bucket } = require('./firebaseConfig'); // Import the Firebase config

const app = express();
const port = 3000;

// Set up multer for file upload
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
});

// Route for uploading a file
app.post('/upload', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    blobStream.on('error', (err) => {
      res.status(500).send('Error uploading file.');
    });

    blobStream.on('finish', async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        await bucket.file(blob.name).makePublic();
        res.status(200).send({ message: 'File uploaded successfully.', url: publicUrl });
      });

    blobStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).send('Error uploading file: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
