const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
//get openai api key from .env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI(OPENAI_API_KEY);

// Test endpoint for OpenAI
router.post('/test', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "user", content: prompt }
            ]
        });

        res.json({
            message: 'OpenAI test successful',
            response: completion.choices[0].message.content
        });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({
            error: 'Failed to process OpenAI request',
            details: error.message
        });
    }
});

module.exports = router; 