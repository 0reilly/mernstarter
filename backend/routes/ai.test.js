const request = require('supertest');
const express = require('express');
const aiRouter = require('./ai');

describe('AI Routes', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api/ai', aiRouter);
    });

    it('should return error when OpenAI API key is not configured', async () => {
        const response = await request(app)
            .post('/api/ai/test')
            .send({ prompt: 'test prompt' });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('OpenAI API key is not configured');
    });

    it('should return error when prompt is missing', async () => {
        process.env.OPENAI_API_KEY = 'test-key';
        
        const response = await request(app)
            .post('/api/ai/test')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Prompt is required');
    });
}); 