import { useState, useEffect, useRef } from "react";
import Hero from "@/components/Hero";
import Chat from "@/components/Chat";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import LoginModal from "@/components/LoginModal";
import { useUser } from "@/contexts/UserContext";

const Index = () => {
  const { isLoggedIn, login } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const chatSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show login modal if user is not logged in
    if (!isLoggedIn) {
      setShowLoginModal(true);
    }
  }, [isLoggedIn]);

  const handleLogin = (name: string) => {
    login(name);
    setShowLoginModal(false);
  };

  const scrollToChat = () => {
    chatSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <LoginModal 
        isOpen={showLoginModal} 
        onLogin={handleLogin}
      />
      <Hero onStartChatting={scrollToChat} />
      <div ref={chatSectionRef} className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Start Your Session
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience how our AI therapist provides empathetic, personalized support 
                that feels like talking to someone who truly understands you.
              </p>
            </div>
            {isLoggedIn && <Chat />}
          </div>
        </div>
      </div>
      <Features />
      <CTA />
    </div>
  );
};

export default Index;
