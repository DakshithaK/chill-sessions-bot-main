import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Sparkles, Phone } from "lucide-react";

const CTA = () => {
  return (
    <div className="py-20 bg-brightGray/30">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border border-carolinaBlue/20 shadow-glow bg-brightGray/50 overflow-hidden relative" 
                style={{ backgroundImage: 'url(/Image1.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="absolute inset-0 bg-chineseBlack/60 backdrop-blur-sm"></div>
            
            <CardContent className="p-12 text-center relative z-10">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-brightGray animate-pulse" />
                <span className="text-brightGray/80 font-medium text-lg">Ready to start your journey?</span>
                <Sparkles className="w-6 h-6 text-brightGray animate-pulse" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-brightGray mb-6 leading-tight">
                Your mental health
                <span className="block bg-gradient-to-r from-carolinaBlue to-brightGray bg-clip-text text-transparent">matters. Start today.</span>
              </h2>
              
              <p className="text-xl text-brightGray/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of Gen Z individuals who've found support, clarity, and growth 
                through our AI therapist. Your first conversation is completely free.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button size="lg" className="bg-carolinaBlue text-brightGray hover:bg-carolinaBlue/90 text-lg px-10 py-4 h-auto font-semibold shadow-card">
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Start Your Free Session
                </Button>
                <Button variant="outline" size="lg" className="border-carolinaBlue/50 text-brightGray hover:bg-carolinaBlue/10 text-lg px-10 py-4 h-auto font-semibold">
                  Learn More
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-6 text-brightGray/70 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-carolinaBlue/70 rounded-full"></div>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-carolinaBlue/70 rounded-full"></div>
                  <span>100% confidential</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-carolinaBlue/70 rounded-full"></div>
                  <span>Available 24/7</span>
                </div>
              </div>
              
              <div className="pt-6 border-t border-carolinaBlue/20">
                <p className="text-brightGray/80 text-sm mb-3">In crisis? Need immediate support?</p>
                <a 
                  href="tel:8277946600" 
                  className="inline-flex items-center gap-2 text-carolinaBlue hover:text-brightGray text-lg font-semibold transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  NIMHANS Crisis Support: 8277946600
                </a>
                <p className="text-brightGray/60 text-xs mt-2">Connect with trained mental health professionals</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CTA;