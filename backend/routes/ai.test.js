const request = require('supertest');
const express = require('express');
const aiRouter = require('./ai');

// Create a mock implementation that we can control
const mockCreate = jest.fn();

// Mock OpenAI
jest.mock('openai', () => {
    return function() {
        return {
            chat: {
                completions: {
                    create: mockCreate
                }
            }
        };
    };
});

describe('AI Routes', () => {
    let app;
    let originalEnv;

    beforeEach(() => {
        // Save original environment
        originalEnv = { ...process.env };
        
        // Reset the mock implementation for each test
        mockCreate.mockReset();
        mockCreate.mockImplementation(async ({ messages }) => {
            return {
                choices: [
                    {
                        message: {
                            content: `Mock response for: ${messages[0].content}`
                        }
                    }
                ]
            };
        });
        
        app = express();
        app.use(express.json());
        app.use('/api/ai', aiRouter);
    });
    
    afterEach(() => {
        // Restore original environment
        process.env = originalEnv;
    });

    it('should return error when OpenAI API key is not configured', async () => {
        // Ensure OPENAI_API_KEY is not set
        delete process.env.OPENAI_API_KEY;
        
        const response = await request(app)
            .post('/api/ai/test')
            .send({ prompt: 'test prompt' });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('OpenAI API key is not configured');
    });

    it('should return error when prompt is missing', async () => {
        // Set a mock API key
        process.env.OPENAI_API_KEY = 'test-key';
        
        const response = await request(app)
            .post('/api/ai/test')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Prompt is required');
    });
    
    it('should return successful response with mocked OpenAI API', async () => {
        // Set a mock API key
        process.env.OPENAI_API_KEY = 'test-key';
        
        const testPrompt = 'This is a test prompt';
        
        const response = await request(app)
            .post('/api/ai/test')
            .send({ prompt: testPrompt });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('OpenAI test successful');
        expect(response.body.response).toBe(`Mock response for: ${testPrompt}`);
    });
    
    it('should handle OpenAI API errors gracefully', async () => {
        // Set a mock API key
        process.env.OPENAI_API_KEY = 'test-key';
        
        // Make the mock throw an error for this test
        mockCreate.mockRejectedValueOnce(new Error('API rate limit exceeded'));
        
        const response = await request(app)
            .post('/api/ai/test')
            .send({ prompt: 'This will cause an error' });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Failed to process OpenAI request');
        expect(response.body.details).toBe('API rate limit exceeded');
    });
}); 