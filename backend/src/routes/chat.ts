import { Router } from 'express';
import { validateRequest, schemas } from '../middleware/validation.js';
import { createError } from '../middleware/errorHandler.js';
import { AIService } from '../services/aiService.js';
import { 
  createSession, 
  getSession, 
  saveMessage, 
  getMessages, 
  getRecentSessions 
} from '../database/init.js';

const router = Router();

// Create a new chat session
router.post('/sessions', 
  validateRequest({ body: schemas.sessionCreate }),
  async (req, res, next) => {
  try {
    const { userName } = req.body;
    const sessionId = await createSession();
    
    // Generate initial AI greeting with user name
    const greeting = await AIService.generateInitialGreeting(userName);
    
    // Save the initial greeting
    await saveMessage({
      sessionId,
      text: greeting,
      sender: 'ai',
    });

    res.status(201).json({
      sessionId,
      greeting,
      message: 'New chat session created successfully',
    });
  } catch (error) {
    next(createError('Failed to create chat session', 500));
  }
});

// Get session details
router.get('/sessions/:sessionId', 
  validateRequest({ params: schemas.session }),
  async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const session = await getSession(sessionId);
      
      if (!session) {
        return next(createError('Session not found', 404));
      }

      res.json({
        session,
        message: 'Session retrieved successfully',
      });
  } catch (error) {
    next(createError('Failed to retrieve session', 500));
  }
});

// Get messages for a session
router.get('/sessions/:sessionId/messages',
  validateRequest({ 
    params: schemas.session,
    query: schemas.pagination 
  }),
  async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      
      const offset = (Number(page) - 1) * Number(limit);
      const messages = await getMessages(sessionId, Number(limit), offset);
      
      res.json({
        messages,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: messages.length,
        },
        message: 'Messages retrieved successfully',
      });
    } catch (error) {
      next(createError('Failed to retrieve messages', 500));
    }
  }
);

// Send a message and get AI response
router.post('/sessions/:sessionId/messages',
  validateRequest({ 
    params: schemas.session,
    body: schemas.message 
  }),
  async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const { text, userName } = req.body;
      
      // Verify session exists
      const session = await getSession(sessionId);
      if (!session) {
        return next(createError('Session not found', 404));
      }

      // Save user message
      const userMessage = await saveMessage({
        sessionId,
        text,
        sender: 'user',
      });

      // Generate AI response with user name context
      const aiResponse = await AIService.generateResponse({
        sessionId,
        userMessage: text,
        userName: userName,
        conversationHistory: [], // Will be loaded by AIService
      });

      // Save AI response
      const aiMessage = await saveMessage({
        sessionId,
        text: aiResponse,
        sender: 'ai',
      });

      res.json({
        userMessage,
        aiMessage,
        message: 'Message sent and response generated successfully',
      });
    } catch (error) {
      console.error('Error in chat endpoint:', error);
      
      if (error instanceof Error && error.message.includes('AI service')) {
        return next(createError('AI service temporarily unavailable', 503));
      }
      
      next(createError('Failed to process message', 500));
    }
  }
);

// Get recent sessions
router.get('/sessions',
  validateRequest({ query: schemas.pagination }),
  async (req, res, next) => {
    try {
      const { limit = 10 } = req.query;
      const sessions = await getRecentSessions(Number(limit));
      
      res.json({
        sessions,
        message: 'Recent sessions retrieved successfully',
      });
    } catch (error) {
      next(createError('Failed to retrieve recent sessions', 500));
    }
  }
);

export default router;
