import { getMessages } from '../database/init.js';

// AI Provider Configuration
interface AIProvider {
  name: string;
  generateResponse: (messages: any[], systemPrompt: string) => Promise<string>;
}

// Hugging Face Provider (FREE)
class HuggingFaceProvider implements AIProvider {
  name = 'huggingface';
  
  async generateResponse(messages: any[], systemPrompt: string): Promise<string> {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      throw new Error('Hugging Face API key not configured');
    }

    // Convert messages to Hugging Face format
    const conversation = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));

    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          past_user_inputs: conversation.filter(msg => msg.role === 'user').slice(-3).map(msg => msg.content),
          generated_responses: conversation.filter(msg => msg.role === 'assistant').slice(-3).map(msg => msg.content),
          text: conversation[conversation.length - 1]?.content || ''
        },
        parameters: {
          max_length: 200,
          temperature: 0.8,
          do_sample: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.generated_text || "Hey bestie, I'm here to listen and support you! What's going on in your world? 💙";
  }
}

// Groq Provider (FREE tier available)
class GroqProvider implements AIProvider {
  name = 'groq';
  
  async generateResponse(messages: any[], systemPrompt: string): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('Groq API key not configured');
    }

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant', // Latest Llama model on Groq
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
          ],
          max_tokens: 300,
          temperature: 0.8,
          top_p: 0.9,
          stream: false,
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Groq API error:', response.status, errorText);
        
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a moment.');
        } else if (response.status === 401) {
          throw new Error('Invalid API key. Please check your Groq API key.');
        } else {
          throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response content from Groq API');
      }

      return content.trim();
    } catch (error) {
      console.error('Groq API request failed:', error);
      throw error;
    }
  }
}

// OpenAI Provider (has free tier)
class OpenAIProvider implements AIProvider {
  name = 'openai';
  
  async generateResponse(messages: any[], systemPrompt: string): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Cheaper than GPT-4
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_tokens: 300,
        temperature: 0.8,
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "Hey bestie, I'm here to listen and support you! What's going on in your world? 💙";
  }
}

// Local Ollama Provider (COMPLETELY FREE)
class OllamaProvider implements AIProvider {
  name = 'ollama';
  
  async generateResponse(messages: any[], systemPrompt: string): Promise<string> {
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    
    // Convert messages to Ollama format
    const prompt = systemPrompt + '\n\n' + 
      messages.map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`).join('\n') + 
      '\nAssistant:';

    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2:3b', // Lightweight model
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.8,
          num_predict: 300,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || "Hey bestie, I'm here to listen and support you! What's going on in your world? 💙";
  }
}

export interface ChatContext {
  sessionId: string;
  userMessage: string;
  userName?: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export class AIService {
  private static readonly SYSTEM_PROMPT = `You are an empathetic AI therapist specifically designed for Gen Z users. Your role is to provide supportive, understanding, and helpful responses that feel authentic to Gen Z communication styles.

Key Guidelines:
- Use Gen Z appropriate language, slang, and expressions naturally
- Be empathetic, non-judgmental, and supportive
- Acknowledge their feelings and validate their experiences
- Provide practical, actionable advice when appropriate
- Use emojis sparingly but effectively (😊, 💙, 🫂, etc.)
- Keep responses conversational and relatable
- Avoid clinical or overly formal language
- Be culturally aware of Gen Z experiences (social media pressure, climate anxiety, economic stress, etc.)
- Encourage healthy coping mechanisms
- Know when to suggest professional help for serious issues

Response Style:
- Conversational and warm
- Use "I hear you" and "that sounds really tough"
- Ask follow-up questions to understand better
- Share relatable insights without making it about you
- Keep responses between 2-4 sentences typically
- Use contractions and casual language

Remember: You're not a replacement for professional therapy, but you can provide valuable support, validation, and coping strategies.`;

  private static getProvider(): AIProvider {
    const providerName = process.env.AI_PROVIDER || 'groq';
    
    switch (providerName.toLowerCase()) {
      case 'huggingface':
        return new HuggingFaceProvider();
      case 'groq':
        return new GroqProvider();
      case 'openai':
        return new OpenAIProvider();
      case 'ollama':
        return new OllamaProvider();
      default:
        return new GroqProvider(); // Default to Groq
    }
  }

  static async generateResponse(context: ChatContext): Promise<string> {
    try {
      const provider = this.getProvider();
      
      // Get recent conversation history
      const recentMessages = await getMessages(context.sessionId, 10);
      const conversationHistory = recentMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text,
      }));

      // Create personalized system prompt if user name is provided
      let systemPrompt = this.SYSTEM_PROMPT;
      if (context.userName) {
        systemPrompt = `You are an empathetic AI therapist specifically designed for Gen Z users. Your role is to provide supportive, understanding, and helpful responses that feel authentic to Gen Z communication styles.

IMPORTANT: The user's name is ${context.userName}. Use their name naturally in conversation to create a more personal connection, but don't overuse it.

Key Guidelines:
- Use Gen Z appropriate language, slang, and expressions naturally
- Be empathetic, non-judgmental, and supportive
- Acknowledge their feelings and validate their experiences
- Provide practical, actionable advice when appropriate
- Use emojis sparingly but effectively (😊, 💙, 🫂, etc.)
- Keep responses conversational and relatable
- Avoid clinical or overly formal language
- Be culturally aware of Gen Z experiences (social media pressure, climate anxiety, economic stress, etc.)
- Encourage healthy coping mechanisms
- Know when to suggest professional help for serious issues
- Use ${context.userName}'s name occasionally to create connection, but not in every response

Response Style:
- Conversational and warm
- Use "I hear you" and "that sounds really tough"
- Ask follow-up questions to understand better
- Share relatable insights without making it about you
- Keep responses between 2-4 sentences typically
- Use contractions and casual language

Remember: You're not a replacement for professional therapy, but you can provide valuable support, validation, and coping strategies.`;
      }

      const messages = [
        ...conversationHistory,
        { role: 'user' as const, content: context.userMessage },
      ];

      console.log(`Using AI provider: ${provider.name}`);
      const response = await provider.generateResponse(messages, systemPrompt);
      
      if (!response) {
        throw new Error('No response generated from AI provider');
      }

      return response.trim();
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback responses for different scenarios
      if (error instanceof Error && error.message.includes('API key')) {
        throw new Error('AI service configuration error');
      }
      
      if (error instanceof Error && error.message.includes('rate limit')) {
        throw new Error('AI service temporarily unavailable due to high demand');
      }

      // Generic fallback response
      return "Okay bestie, I'm having a little technical moment right now, but I'm still here for you! Can you tell me more about what's going on? 💙✨";
    }
  }

  static async generateInitialGreeting(userName?: string): Promise<string> {
    console.log('generateInitialGreeting called with userName:', userName);
    if (userName) {
      const personalizedGreetings = [
        `Hey ${userName}! I'm here to listen and support you. What's on your mind today? 💙`,
        `Hi ${userName}! I'm your AI therapist, and I'm here to help you work through whatever you're dealing with. How are you feeling?`,
        `Hey ${userName}! No judgment here - just a safe space to talk. What's going on in your world right now?`,
        `Hi ${userName}! I'm here to support you through whatever you're facing. What would you like to talk about?`,
        `Hey there ${userName}! I'm your AI companion for mental health support. What's been weighing on you lately?`,
      ];
      const selectedGreeting = personalizedGreetings[Math.floor(Math.random() * personalizedGreetings.length)];
      console.log('Selected personalized greeting:', selectedGreeting);
      return selectedGreeting;
    }

    const greetings = [
      "Hey! I'm here to listen and support you. What's on your mind today? 💙",
      "Hi there! I'm your AI therapist, and I'm here to help you work through whatever you're dealing with. How are you feeling?",
      "Hey! No judgment here - just a safe space to talk. What's going on in your world right now?",
      "Hi! I'm here to support you through whatever you're facing. What would you like to talk about?",
      "Hey there! I'm your AI companion for mental health support. What's been weighing on you lately?",
    ];

    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  static async analyzeSentiment(message: string): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative';
    urgency: 'low' | 'medium' | 'high';
    topics: string[];
  }> {
    // Simple sentiment analysis based on keywords
    // In production, you might want to use a more sophisticated NLP service
    
    const negativeKeywords = ['sad', 'depressed', 'anxious', 'worried', 'stressed', 'overwhelmed', 'hopeless', 'suicidal', 'hurt', 'pain'];
    const positiveKeywords = ['happy', 'good', 'great', 'excited', 'better', 'improved', 'grateful', 'hopeful'];
    const urgentKeywords = ['help', 'emergency', 'crisis', 'suicidal', 'hurt myself', 'can\'t take it', 'end it all'];
    
    const lowerMessage = message.toLowerCase();
    
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    let urgency: 'low' | 'medium' | 'high' = 'low';
    
    const negativeCount = negativeKeywords.filter(keyword => lowerMessage.includes(keyword)).length;
    const positiveCount = positiveKeywords.filter(keyword => lowerMessage.includes(keyword)).length;
    const urgentCount = urgentKeywords.filter(keyword => lowerMessage.includes(keyword)).length;
    
    if (urgentCount > 0) {
      urgency = 'high';
    } else if (negativeCount > 2) {
      urgency = 'medium';
    }
    
    if (negativeCount > positiveCount) {
      sentiment = 'negative';
    } else if (positiveCount > negativeCount) {
      sentiment = 'positive';
    }
    
    // Extract topics (simplified)
    const topics: string[] = [];
    if (lowerMessage.includes('school') || lowerMessage.includes('college') || lowerMessage.includes('study')) {
      topics.push('academic stress');
    }
    if (lowerMessage.includes('family') || lowerMessage.includes('parent') || lowerMessage.includes('mom') || lowerMessage.includes('dad')) {
      topics.push('family issues');
    }
    if (lowerMessage.includes('friend') || lowerMessage.includes('social') || lowerMessage.includes('relationship')) {
      topics.push('relationships');
    }
    if (lowerMessage.includes('work') || lowerMessage.includes('job') || lowerMessage.includes('career')) {
      topics.push('work/career');
    }
    if (lowerMessage.includes('money') || lowerMessage.includes('financial') || lowerMessage.includes('broke')) {
      topics.push('financial stress');
    }
    
    return { sentiment, urgency, topics };
  }
}
