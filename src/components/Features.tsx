import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, Flower, Zap, Users, Brain } from "lucide-react";

const features = [
  {
    icon: Flower,
    title: "Empathetic AI",
    description: "Our AI is trained to understand Gen Z communication styles, slang, and the unique challenges you face."
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "3AM anxiety? Midday crisis? We're always here. No appointments needed, no waiting rooms, no judgment."
  },
  {
    icon: Shield,
    title: "100% Private",
    description: "What you share stays between you and the AI. End-to-end encrypted conversations that nobody else can access."
  },
  {
    icon: Zap,
    title: "Instant Support",
    description: "Get immediate responses when you need them most. No waiting weeks for an appointment or sitting in crisis."
  },
  {
    icon: Brain,
    title: "Evidence-Based",
    description: "Built on proven therapeutic techniques like CBT, DBT, and mindfulness practices, adapted for digital natives."
  },
  {
    icon: Users,
    title: "Gen Z Focused",
    description: "Understands social media pressure, climate anxiety, financial stress, and all the unique challenges of your generation."
  }
];

const Features = () => {
  return (
    <div className="py-20 relative" 
         style={{ backgroundImage: 'url(/Image2.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-chineseBlack/40 backdrop-blur-sm"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brightGray mb-6">
              Why Choose Our AI Therapist?
            </h2>
            <p className="text-xl text-brightGray/80 max-w-3xl mx-auto">
              We've built something different. No more outdated therapy that doesn't get your world. 
              This is mental health support that actually speaks your language.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-carolinaBlue/20 shadow-card hover:shadow-glow transition-all duration-300 group bg-brightGray/50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-carolinaBlue rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-brightGray" />
                  </div>
                  <h3 className="text-xl font-semibold text-chineseBlack mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-chineseBlack/70 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;