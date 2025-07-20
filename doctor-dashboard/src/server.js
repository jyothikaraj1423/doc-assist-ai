const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

const DEEPGRAM_API_KEY = '73e2597ca37c62b2ffb32f7bcd345c3e2f4afdaf'; // <-- Paste your key here

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const audioPath = req.file.path;
    const audioBuffer = fs.readFileSync(audioPath);

    const response = await fetch('https://api.deepgram.com/v1/listen?diarize=true', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
        'Content-Type': req.file.mimetype,
      },
      body: audioBuffer,
    });

    const data = await response.json();

    // Clean up uploaded file
    fs.unlinkSync(audioPath);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5001, () => {
  console.log('Server running on http://localhost:5001');
});
