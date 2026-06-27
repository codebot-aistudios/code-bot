const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// This reads your secret API key from Vercel settings safely
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post('/api/generate', async (req, res) => {
    const { promptTxt, systemRole } = req.body;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemRole}\n\nUser Request: ${promptTxt}` }] }]
            })
        });
        const data = await response.json();
        const resultText = data.candidates[0].content.parts[0].text;
        res.json({ text: resultText });
    } catch (error) {
        res.status(500).json({ error: "Backend server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
                  
