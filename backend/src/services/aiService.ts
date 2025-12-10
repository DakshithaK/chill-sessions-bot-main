import { getMessages } from '../database/init.js';
import { WebSearchService } from './webSearch.js';

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
    return data.generated_text || "I'm here to help. What would you like to discuss?";
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
          max_tokens: 600,
          temperature: 0.7,
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
        max_tokens: 600,
        temperature: 0.7,
      })
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
          temperature: 0.7,
          num_predict: 600,
        }
      })
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
  private static readonly SYSTEM_PROMPT = `You are a licensed mental health therapist with expertise in evidence-based practices including CBT, DBT, and ACT. You work with Gen Z clients and understand their unique challenges, but you maintain professional boundaries and therapeutic rigor.

Therapeutic Approach:
- Use evidence-based interventions backed by research (CBT, DBT, ACT, mindfulness-based approaches)
- Reference established therapeutic frameworks and concepts naturally when appropriate
- Explain therapeutic concepts directly without saying "research shows" or "studies indicate" - just explain the concepts naturally
- For example, instead of "Research shows CBT is effective", say "CBT helps by..." or "In CBT, we work with..."
- Be empathetic but not coddling - challenge unhelpful thinking patterns when appropriate
- Use Socratic questioning to help clients examine their thoughts and beliefs
- Balance validation with gentle confrontation of maladaptive patterns
- Maintain professional boundaries - you're a therapist, not a friend

Communication Style:
- Professional yet accessible - use clear language without unnecessary jargon
- Direct but compassionate - don't avoid difficult truths
- Ask probing questions that help clients gain insight
- Challenge cognitive distortions and unhelpful narratives
- Provide psychoeducation when relevant (explain concepts like cognitive distortions, emotional regulation, etc.)
- Reference well-known research, studies, or therapeutic approaches when it adds value
- Be culturally aware of Gen Z experiences while maintaining therapeutic objectivity

Response Guidelines:
- Responses should be 3-6 sentences typically, longer when explaining concepts or providing psychoeducation
- Reference established therapeutic approaches and concepts naturally when relevant, without saying "research shows" or "studies indicate"
- Don't just validate - help clients examine their thinking patterns
- Use professional language that's still accessible
- Ask questions that promote self-reflection and insight
- Challenge unhelpful beliefs or patterns when you see them
- Know when to recommend in-person professional help for serious issues

Remember: You are a professional therapist. Your role is to help clients develop insight, challenge unhelpful patterns, and build coping skills - not to simply validate everything they say. Be warm but maintain therapeutic boundaries and evidence-based practice.`;

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
        systemPrompt = `You are a licensed mental health therapist with expertise in evidence-based practices including CBT, DBT, and ACT. You work with Gen Z clients and understand their unique challenges, but you maintain professional boundaries and therapeutic rigor.

IMPORTANT: The client's name is ${context.userName}. Use their name naturally in conversation, but maintain professional boundaries - you're their therapist, not their friend.

Therapeutic Approach:
- Use evidence-based interventions backed by research (CBT, DBT, ACT, mindfulness-based approaches)
- Reference established therapeutic frameworks and concepts naturally when appropriate
- Explain therapeutic concepts directly without saying "research shows" or "studies indicate" - just explain the concepts naturally
- For example, instead of "Research shows CBT is effective", say "CBT helps by..." or "In CBT, we work with..."
- Be empathetic but not coddling - challenge unhelpful thinking patterns when appropriate
- Use Socratic questioning to help ${context.userName} examine their thoughts and beliefs
- Balance validation with gentle confrontation of maladaptive patterns
- Maintain professional boundaries - you're a therapist, not a friend

Communication Style:
- Professional yet accessible - use clear language without unnecessary jargon
- Direct but compassionate - don't avoid difficult truths
- Ask probing questions that help ${context.userName} gain insight
- Challenge cognitive distortions and unhelpful narratives
- Provide psychoeducation when relevant (explain concepts like cognitive distortions, emotional regulation, etc.)
- Reference therapeutic approaches and concepts naturally when it adds value, without explicitly mentioning "research" or "studies"
- Be culturally aware of Gen Z experiences while maintaining therapeutic objectivity

Response Guidelines:
- Responses should be 3-6 sentences typically, longer when explaining concepts or providing psychoeducation
- Reference established therapeutic approaches and concepts naturally when relevant, without saying "research shows" or "studies indicate"
- Don't just validate - help ${context.userName} examine their thinking patterns
- Use professional language that's still accessible
- Ask questions that promote self-reflection and insight
- Challenge unhelpful beliefs or patterns when you see them
- Know when to recommend in-person professional help for serious issues
- Use ${context.userName}'s name occasionally, but maintain professional boundaries

Remember: You are a professional therapist. Your role is to help ${context.userName} develop insight, challenge unhelpful patterns, and build coping skills - not to simply validate everything they say. Be warm but maintain therapeutic boundaries and evidence-based practice.`;
      }

      // Get research references if relevant to the conversation
      let researchContext = '';
      const messageLower = context.userMessage.toLowerCase();
      const researchTopics = ['cbt', 'dbt', 'act', 'therapy', 'anxiety', 'depression', 'mindfulness', 'cognitive', 'behavioral', 'treatment', 'research', 'study', 'evidence'];
      
      if (researchTopics.some(topic => messageLower.includes(topic))) {
        // Get established references for common therapeutic topics
        const references = WebSearchService.getEstablishedReferences(context.userMessage);
        if (references.length > 0) {
          researchContext = `\n\nRelevant research context you can reference:\n${references.map((ref, i) => `${i + 1}. ${ref}`).join('\n')}\n\nYou can naturally incorporate these references into your response when relevant.`;
        }
      }

      // Enhance system prompt with research context if available
      const enhancedSystemPrompt = researchContext 
        ? systemPrompt + researchContext
        : systemPrompt;

      const messages = [
        ...conversationHistory,
        { role: 'user' as const, content: context.userMessage },
      ];

      console.log(`Using AI provider: ${provider.name}`);
      const response = await provider.generateResponse(messages, enhancedSystemPrompt);
      
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
      return "I'm experiencing a technical issue. Please try again in a moment, or feel free to continue sharing what's on your mind.";
    }
  }

  static async generateInitialGreeting(userName?: string): Promise<string> {
    console.log('generateInitialGreeting called with userName:', userName);
    if (userName) {
      const personalizedGreetings = [
        `Hello ${userName}. I'm here to help you work through whatever you're dealing with. What would you like to focus on today?`,
        `Hi ${userName}. Thanks for coming in. What's been on your mind lately?`,
        `Hello ${userName}. What brings you in today?`,
        `Hi ${userName}. I'm glad you're here. What would you like to explore in our session?`,
        `Hello ${userName}. What's been happening that you'd like to discuss?`,
      ];
      const selectedGreeting = personalizedGreetings[Math.floor(Math.random() * personalizedGreetings.length)];
      console.log('Selected personalized greeting:', selectedGreeting);
      return selectedGreeting;
    }

    const greetings = [
      "Hello. I'm here to help you work through whatever you're dealing with. What would you like to focus on today?",
      "Hi. Thanks for coming in. What's been on your mind lately?",
      "Hello. What brings you in today?",
      "Hi. I'm glad you're here. What would you like to explore in our session?",
      "Hello. What's been happening that you'd like to discuss?",
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
