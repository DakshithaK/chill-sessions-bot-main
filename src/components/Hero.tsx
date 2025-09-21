import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageCircle, Flower, Users, ArrowRight, Heart, Shield, Clock } from "lucide-react";
import { useState } from "react";

interface HeroProps {
  onStartChatting?: () => void;
}

const Hero = ({ onStartChatting }: HeroProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" 
         style={{ backgroundImage: 'url(/backgroundImage.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Background overlay */}
      <div className="absolute inset-0 bg-chineseBlack/60 backdrop-blur-sm"></div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 bg-brightGray/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-carolinaBlue/30">
            <Flower className="w-5 h-5 text-carolinaBlue" />
            <span className="text-brightGray font-medium">AI-Powered Mental Health Support</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-brightGray mb-6 leading-tight">
            Your AI therapist that
            <span className="block bg-gradient-to-r from-carolinaBlue to-brightGray bg-clip-text text-transparent">
              actually gets you
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-brightGray/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Finally, mental health support designed for Gen Z. No judgment, no waiting lists, 
            no awkward small talk. Just real conversations that help.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-carolinaBlue text-brightGray hover:bg-carolinaBlue/90 text-lg px-8 py-4 h-auto font-semibold shadow-card"
              onClick={onStartChatting}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Chatting Now
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="border-carolinaBlue/50 !text-brightGray hover:bg-carolinaBlue/10 text-lg px-8 py-4 h-auto font-semibold">
                  <Users className="w-5 h-5 mr-2" />
                  Learn How It Works
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-brightGray/95 border border-carolinaBlue/20 text-chineseBlack">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center text-chineseBlack mb-4">
                    How Our AI Therapist Works
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <p className="text-lg text-chineseBlack/80">
                      Getting started is super simple! Here's everything you need to know:
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-carolinaBlue/10 rounded-lg">
                      <div className="w-8 h-8 bg-carolinaBlue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-brightGray font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-chineseBlack mb-2">Just Start Typing</h3>
                        <p className="text-chineseBlack/70">
                          No signup forms, no questionnaires. Just type what's on your mind and hit send. 
                          Our AI therapist is ready to listen and help.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 bg-carolinaBlue/10 rounded-lg">
                      <div className="w-8 h-8 bg-carolinaBlue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-brightGray font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-chineseBlack mb-2">Get Empathetic Responses</h3>
                        <p className="text-chineseBlack/70">
                          Our AI understands Gen Z language, slang, and the unique challenges you face. 
                          It responds with empathy, not judgment.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 bg-carolinaBlue/10 rounded-lg">
                      <div className="w-8 h-8 bg-carolinaBlue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-brightGray font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-chineseBlack mb-2">Stay Anonymous & Safe</h3>
                        <p className="text-chineseBlack/70">
                          Everything you share is completely private. No data is stored permanently, 
                          and no one else can see your conversations.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-carolinaBlue/20 to-brightGray/20 p-6 rounded-lg border border-carolinaBlue/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Heart className="w-6 h-6 text-carolinaBlue" />
                      <h3 className="font-semibold text-chineseBlack">Remember</h3>
                    </div>
                    <p className="text-chineseBlack/80">
                      This is a supportive AI companion, not a replacement for professional therapy. 
                      If you're in crisis, please reach out to a mental health professional or crisis hotline.
                    </p>
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <Button 
                      onClick={() => setIsDialogOpen(false)}
                      className="bg-carolinaBlue text-brightGray hover:bg-carolinaBlue/90"
                    >
                      Got it! Let's start chatting
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-brightGray mb-2">24/7</div>
              <div className="text-brightGray/70">Always Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brightGray mb-2">10k+</div>
              <div className="text-brightGray/70">Lives Improved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brightGray mb-2">100%</div>
              <div className="text-brightGray/70">Confidential</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-carolinaBlue/20 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-32 right-32 w-16 h-16 bg-carolinaBlue/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-20 w-12 h-12 bg-carolinaBlue/20 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default Hero;