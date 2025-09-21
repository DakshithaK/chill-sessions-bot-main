const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface Session {
  id: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface ChatResponse {
  userMessage: Message;
  aiMessage: Message;
  message: string;
}

export interface SessionResponse {
  sessionId: string;
  greeting: string;
  message: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Create a new chat session
  async createSession(userName?: string): Promise<SessionResponse> {
    return this.request<SessionResponse>('/chat/sessions', {
      method: 'POST',
      body: JSON.stringify({ userName }),
    });
  }

  // Get session details
  async getSession(sessionId: string): Promise<{ session: Session; message: string }> {
    return this.request<{ session: Session; message: string }>(`/chat/sessions/${sessionId}`);
  }

  // Get messages for a session
  async getMessages(
    sessionId: string, 
    page: number = 1, 
    limit: number = 20
  ): Promise<{ messages: Message[]; pagination: any; message: string }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    return this.request<{ messages: Message[]; pagination: any; message: string }>(
      `/chat/sessions/${sessionId}/messages?${params}`
    );
  }

  // Send a message and get AI response
  async sendMessage(sessionId: string, text: string, userName?: string): Promise<ChatResponse> {
    return this.request<ChatResponse>(`/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text, userName }),
    });
  }

  // Get recent sessions
  async getRecentSessions(limit: number = 10): Promise<{ sessions: Session[]; message: string }> {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });
    
    return this.request<{ sessions: Session[]; message: string }>(
      `/chat/sessions?${params}`
    );
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; uptime: number }> {
    return this.request<{ status: string; timestamp: string; uptime: number }>('/health');
  }

  // AI service health check
  async aiHealthCheck(): Promise<{ status: string; aiProvider: string; testResponse: string }> {
    return this.request<{ status: string; aiProvider: string; testResponse: string }>('/health/ai');
  }
}

export const apiService = new ApiService();
