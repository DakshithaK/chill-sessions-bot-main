import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { apiService, Message } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

interface ChatProps {
  className?: string;
}

const Chat = ({ className }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { userName } = useUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat session
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsInitializing(true);
        const response = await apiService.createSession(userName || undefined);
        setSessionId(response.sessionId);
        
        // Add the initial greeting
        const greetingMessage: Message = {
          id: 'greeting',
          text: response.greeting,
          sender: 'ai',
          timestamp: new Date().toISOString(),
        };
        setMessages([greetingMessage]);
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to the AI service. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsInitializing(false);
      }
    };

    if (userName) {
      initializeChat();
    }
  }, [toast, userName]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !sessionId || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await apiService.sendMessage(sessionId, inputValue, userName || undefined);
      
      // Add AI response
      setMessages(prev => [...prev, response.aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "I'm having trouble responding right now. Please try again in a moment. 💙",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Message Failed",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isFullscreen]);

  if (isInitializing) {
    const containerClass = isFullscreen 
      ? "fixed inset-0 z-50 bg-background" 
      : `max-w-2xl mx-auto shadow-card bg-brightGray/50 border border-carolinaBlue/20 ${className}`;
    
    return (
      <Card className={containerClass}>
        <div className="p-6 border-b bg-carolinaBlue rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brightGray/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-brightGray" />
              </div>
              <div>
                <h3 className="text-brightGray font-semibold">AI Therapist</h3>
                <p className="text-brightGray/80 text-sm">Connecting...</p>
              </div>
            </div>
            {!isFullscreen && (
              <Button
                onClick={toggleFullscreen}
                variant="ghost"
                size="icon"
                className="text-brightGray hover:bg-brightGray/20"
              >
                <Maximize2 className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
        <div className={`${isFullscreen ? 'h-[calc(100vh-140px)]' : 'h-96'} flex items-center justify-center relative`} 
             style={{ backgroundImage: 'url(/Image4.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-brightGray/20 backdrop-blur-sm"></div>
          <div className="flex items-center gap-3 text-chineseBlack/70 relative z-10">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Initializing chat session...</span>
          </div>
        </div>
      </Card>
    );
  }

  const containerClass = isFullscreen 
    ? "fixed inset-0 z-50 bg-background" 
    : `max-w-2xl mx-auto shadow-card bg-brightGray/50 border border-carolinaBlue/20 ${className}`;

  return (
    <Card className={containerClass}>
      {/* Chat Header */}
      <div className="p-6 border-b bg-carolinaBlue rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brightGray/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-brightGray" />
            </div>
            <div>
              <h3 className="text-brightGray font-semibold">AI Therapist</h3>
              <p className="text-brightGray/80 text-sm">Always here to listen</p>
            </div>
          </div>
          <Button
            onClick={toggleFullscreen}
            variant="ghost"
            size="icon"
            className="text-brightGray hover:bg-brightGray/20"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className={`${isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-96'} overflow-y-auto p-6 space-y-4 relative`} 
           style={{ backgroundImage: 'url(/Image4.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-brightGray/20 backdrop-blur-sm"></div>
        <div className="relative z-10 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              message.sender === "user" 
                ? "bg-carolinaBlue" 
                : "bg-carolinaBlue"
            }`}>
              {message.sender === "user" ? (
                <User className="w-4 h-4 text-brightGray" />
              ) : (
                <Bot className="w-4 h-4 text-brightGray" />
              )}
            </div>
            <div className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl ${
              message.sender === "user"
                ? "bg-carolinaBlue text-brightGray ml-auto"
                : "bg-brightGray/80 text-chineseBlack"
            }`}>
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-carolinaBlue flex items-center justify-center">
              <Bot className="w-4 h-4 text-brightGray" />
            </div>
            <div className="bg-brightGray/80 px-4 py-2 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-chineseBlack/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-chineseBlack/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-chineseBlack/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className={`${isFullscreen ? 'p-8' : 'p-6'} border-t bg-brightGray/30`}>
        <div className={`flex gap-3 ${isFullscreen ? 'max-w-4xl mx-auto' : ''}`}>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className={`flex-1 bg-brightGray/50 border-carolinaBlue/30 text-chineseBlack placeholder:text-chineseBlack/50 ${isFullscreen ? 'text-lg py-4' : ''}`}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            className={`bg-carolinaBlue hover:bg-carolinaBlue/90 text-brightGray ${isFullscreen ? 'w-12 h-12' : ''}`}
            size="icon"
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        {isFullscreen && (
          <div className="text-center mt-4 text-chineseBlack/60 text-sm">
            Press <kbd className="px-2 py-1 bg-brightGray/50 rounded text-xs">Esc</kbd> to exit fullscreen
          </div>
        )}
      </div>
    </Card>
  );
};

export default Chat;
