import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const ChatPreview = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey! I'm feeling pretty overwhelmed with college applications and just life in general. Everything feels so stressful right now 😔",
      sender: "user",
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: 2,
      text: "I hear you - that sounds really tough. College applications are a huge source of stress for so many people your age. It's totally valid to feel overwhelmed by all of this. What's been weighing on you the most?",
      sender: "ai",
      timestamp: new Date(Date.now() - 60000)
    },
    {
      id: 3,
      text: "I guess I just feel like I'm not good enough? Like everyone else seems to have it figured out and I'm just... struggling",
      sender: "user",
      timestamp: new Date(Date.now() - 30000)
    }
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: "That feeling of 'not being good enough' is so common, but it doesn't reflect reality. Comparison is really hard to avoid, especially when everyone shares their highlights on social media. What you're experiencing is imposter syndrome, and it's actually a sign that you care deeply about doing well. Let's work through some strategies to help you feel more confident in your abilities.",
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="py-20 bg-brightGray/30">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-chineseBlack mb-6">
              See It In Action
            </h2>
            <p className="text-xl text-chineseBlack/70 max-w-2xl mx-auto">
              Experience how our AI therapist provides empathetic, personalized support 
              that feels like talking to someone who truly understands you.
            </p>
          </div>

          <Card className="max-w-2xl mx-auto shadow-card bg-brightGray/50 border border-carolinaBlue/20">
            {/* Chat Header */}
            <div className="p-6 border-b bg-carolinaBlue rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brightGray/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-brightGray" />
                </div>
                <div>
                  <h3 className="text-brightGray font-semibold">AI Therapist</h3>
                  <p className="text-brightGray/80 text-sm">Always here to listen</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
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
              
              {isTyping && (
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
            </div>

            {/* Input */}
            <div className="p-6 border-t bg-brightGray/30">
              <div className="flex gap-3">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-brightGray/50 border-carolinaBlue/30 text-chineseBlack placeholder:text-chineseBlack/50"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-carolinaBlue hover:bg-carolinaBlue/90 text-brightGray"
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatPreview;