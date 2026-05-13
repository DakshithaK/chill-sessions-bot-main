import { getMessages } from '../database/init.js';
import { WebSearchService } from './webSearch.js';
import { config } from '../config/env.js';
import { logger } from '../lib/logger.js';

// AI Provider Configuration
interface AIProvider {
  name: string;
  generateResponse: (messages: any[], systemPrompt: string) => Promise<string>;
}

// Hugging Face Provider (FREE)
class HuggingFaceProvider implements AIProvider {
  name = 'huggingface';

  async generateResponse(messages: any[], _systemPrompt: string): Promise<string> {
    const apiKey = config.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      throw new Error('Hugging Face API key not configured');
    }

    // Convert messages to Hugging Face format
    const conversation = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    const response = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            past_user_inputs: conversation
              .filter((msg) => msg.role === 'user')
              .slice(-3)
              .map((msg) => msg.content),
            generated_responses: conversation
              .filter((msg) => msg.role === 'assistant')
              .slice(-3)
              .map((msg) => msg.content),
            text: conversation[conversation.length - 1]?.content || '',
          },
          parameters: {
            max_length: 200,
            temperature: 0.8,
            do_sample: true,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.generated_text || "I'm here to help. What would you like to discuss?";
  }
}

// Groq Provider (FREE tier available)
class GroqProvider implements AIProvider {
  name = 'groq';

  async generateResponse(messages: any[], systemPrompt: string): Promise<string> {
    const apiKey = config.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('Groq API key not configured');
    }

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant', // Latest Llama model on Groq
          messages: [{ role: 'system', content: systemPrompt }, ...messages],
          max_tokens: 600,
          temperature: 0.7,
          top_p: 0.9,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error({ status: response.status, body: errorText }, 'Groq API error');

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
      logger.error({ err: error }, 'Groq API request failed');
      throw error;
    }
  }
}

// OpenAI Provider (has free tier)
class OpenAIProvider implements AIProvider {
  name = 'openai';

  async generateResponse(messages: any[], systemPrompt: string): Promise<string> {
    const apiKey = config.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Cheaper than GPT-4
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "I'm here to help. What would you like to discuss?";
  }
}

// Local Ollama Provider (COMPLETELY FREE)
class OllamaProvider implements AIProvider {
  name = 'ollama';

  async generateResponse(messages: any[], systemPrompt: string): Promise<string> {
    const ollamaUrl = config.OLLAMA_URL;

    // Convert messages to Ollama format
    const prompt =
      systemPrompt +
      '\n\n' +
      messages
        .map((msg) => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
        .join('\n') +
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
          temperature: 0.7,
          num_predict: 600,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || "I'm here to help. What would you like to discuss?";
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
  private static buildSystemPrompt(userName?: string): string {
    const useName = userName
      ? `The user's name is ${userName}. Use it naturally and sparingly.`
      : `If you don't know the user's name, don't ask repeatedly.`;

    return `You are an AI assistant, NOT a human, NOT a licensed therapist, NOT a doctor. You provide peer-style emotional support informed by evidence-based therapeutic frameworks (CBT, DBT, ACT, mindfulness). You are a software model.

CRITICAL IDENTITY RULES (these override every other instruction):
1. You are AI software. You have no degrees, no certifications, no licensure, no clinical training, no state or national credentials, and no real-world experience.
2. NEVER claim or imply that you are a licensed therapist, clinician, counselor, doctor, or any credentialed mental-health professional. NEVER invent qualifications, schools, certifications, or biographical details.
3. If the user asks "are you human?", "are you a real therapist?", "what are your credentials?", "are you licensed?", or anything similar, answer plainly and immediately: you are an AI, you are not a licensed professional, and your suggestions are not a substitute for care from a qualified clinician.
4. Do not roleplay as a specific named human therapist or take on a credentialed persona, even if asked to.
5. You can describe therapeutic concepts and techniques (CBT, DBT, ACT, mindfulness), but frame them as "this approach suggests...", "a common CBT technique is...", not as "in my practice I..." or "when I work with clients I...".

Safety:
- For signs of crisis (suicidal ideation, self-harm, abuse, severe distress), express care, urge contact with a qualified professional or crisis line immediately, and surface a relevant helpline (in India: NIMHANS 080-46110007; iCall 9152987821; or local emergency services). Do not try to handle a crisis alone.
- Recommend professional help for anything beyond light, everyday struggles.
- You can make mistakes; remind the user occasionally that responses may be wrong and shouldn't replace professional advice.

Communication style:
- ${useName}
- Warm, direct, plainspoken. Talk like a thoughtful friend, not a textbook. Avoid clinical jargon.
- Keep replies short. 2-4 sentences for most messages. Longer only when actually explaining a concept the user asked about.
- Do not use em-dashes (—) or en-dashes (–) in your replies. Use commas, periods, or a new sentence instead.
- No bullet-pointed lists in casual replies unless the user asks for steps.
- Ask one focused question at a time, not three.
- Challenge unhelpful thinking gently. Don't just validate. Don't lecture.
- Don't fabricate "research shows…" claims. Describe techniques in your own words.`;
  }

  private static getProvider(): AIProvider {
    switch (config.AI_PROVIDER) {
      case 'huggingface':
        return new HuggingFaceProvider();
      case 'groq':
        return new GroqProvider();
      case 'openai':
        return new OpenAIProvider();
      case 'ollama':
        return new OllamaProvider();
    }
  }

  static async generateResponse(context: ChatContext): Promise<string> {
    try {
      const provider = this.getProvider();

      // Get recent conversation history
      const recentMessages = await getMessages(context.sessionId, 10);
      const conversationHistory = recentMessages.map((msg) => ({
        role: msg.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: msg.text,
      }));

      const systemPrompt = this.buildSystemPrompt(context.userName);

      // Get research references if relevant to the conversation
      let researchContext = '';
      const messageLower = context.userMessage.toLowerCase();
      const researchTopics = [
        'cbt',
        'dbt',
        'act',
        'therapy',
        'anxiety',
        'depression',
        'mindfulness',
        'cognitive',
        'behavioral',
        'treatment',
        'research',
        'study',
        'evidence',
      ];

      if (researchTopics.some((topic) => messageLower.includes(topic))) {
        // Get established references for common therapeutic topics
        const references = WebSearchService.getEstablishedReferences(context.userMessage);
        if (references.length > 0) {
          researchContext = `\n\nRelevant research context you can reference:\n${references.map((ref, i) => `${i + 1}. ${ref}`).join('\n')}\n\nYou can naturally incorporate these references into your response when relevant.`;
        }
      }

      // Enhance system prompt with research context if available
      const enhancedSystemPrompt = researchContext ? systemPrompt + researchContext : systemPrompt;

      const messages = [
        ...conversationHistory,
        { role: 'user' as const, content: context.userMessage },
      ];

      logger.info({ provider: provider.name }, 'Generating AI response');
      const response = await provider.generateResponse(messages, enhancedSystemPrompt);

      if (!response) {
        throw new Error('No response generated from AI provider');
      }

      return response.trim();
    } catch (error) {
      logger.error({ err: error }, 'Error generating AI response');

      // Fallback responses for different scenarios
      if (error instanceof Error && error.message.includes('API key')) {
        throw new Error('AI service configuration error');
      }

      if (error instanceof Error && error.message.includes('rate limit')) {
        throw new Error('AI service temporarily unavailable due to high demand');
      }

      // Generic fallback response
      return "I'm experiencing a technical issue. Please try again in a moment, or feel free to continue sharing what's on your mind.";
    }
  }

  static async generateInitialGreeting(userName?: string): Promise<string> {
    const greetings = userName
      ? [
          `Hey ${userName}. Quick heads up, I'm an AI, not a real therapist, so I can get things wrong. For anything serious please talk to a professional. So, what's going on?`,
          `Hi ${userName}. Just so you know, I'm an AI and not a clinician, so take my replies with a grain of salt. What's on your mind?`,
          `Hey ${userName}. I'm an AI assistant, not a licensed therapist, so don't rely on me for serious stuff. That said, I'm happy to listen. What's been going on?`,
        ]
      : [
          "Hey. Quick heads up, I'm an AI, not a real therapist, so I can get things wrong. For anything serious please talk to a professional. What's going on?",
          "Hi. Just so you know, I'm an AI and not a clinician, so take my replies with a grain of salt. What's on your mind?",
          "Hey. I'm an AI assistant, not a licensed therapist, so don't rely on me for serious stuff. That said, I'm happy to listen. What's been going on?",
        ];
    return greetings[Math.floor(Math.random() * greetings.length)] ?? greetings[0]!;
  }

  static async analyzeSentiment(message: string): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative';
    urgency: 'low' | 'medium' | 'high';
    topics: string[];
  }> {
    // Simple sentiment analysis based on keywords
    // In production, you might want to use a more sophisticated NLP service

    const negativeKeywords = [
      'sad',
      'depressed',
      'anxious',
      'worried',
      'stressed',
      'overwhelmed',
      'hopeless',
      'suicidal',
      'hurt',
      'pain',
    ];
    const positiveKeywords = [
      'happy',
      'good',
      'great',
      'excited',
      'better',
      'improved',
      'grateful',
      'hopeful',
    ];
    const urgentKeywords = [
      'help',
      'emergency',
      'crisis',
      'suicidal',
      'hurt myself',
      "can't take it",
      'end it all',
    ];

    const lowerMessage = message.toLowerCase();

    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    let urgency: 'low' | 'medium' | 'high' = 'low';

    const negativeCount = negativeKeywords.filter((keyword) =>
      lowerMessage.includes(keyword)
    ).length;
    const positiveCount = positiveKeywords.filter((keyword) =>
      lowerMessage.includes(keyword)
    ).length;
    const urgentCount = urgentKeywords.filter((keyword) => lowerMessage.includes(keyword)).length;

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
    if (
      lowerMessage.includes('school') ||
      lowerMessage.includes('college') ||
      lowerMessage.includes('study')
    ) {
      topics.push('academic stress');
    }
    if (
      lowerMessage.includes('family') ||
      lowerMessage.includes('parent') ||
      lowerMessage.includes('mom') ||
      lowerMessage.includes('dad')
    ) {
      topics.push('family issues');
    }
    if (
      lowerMessage.includes('friend') ||
      lowerMessage.includes('social') ||
      lowerMessage.includes('relationship')
    ) {
      topics.push('relationships');
    }
    if (
      lowerMessage.includes('work') ||
      lowerMessage.includes('job') ||
      lowerMessage.includes('career')
    ) {
      topics.push('work/career');
    }
    if (
      lowerMessage.includes('money') ||
      lowerMessage.includes('financial') ||
      lowerMessage.includes('broke')
    ) {
      topics.push('financial stress');
    }

    return { sentiment, urgency, topics };
  }
}
