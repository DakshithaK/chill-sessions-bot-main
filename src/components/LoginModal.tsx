import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Heart } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (name: string) => void;
}

const LoginModal = ({ isOpen, onLogin }: LoginModalProps) => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      onLogin(name.trim());
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && name.trim()) {
      handleSubmit(e as any);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md bg-brightGray/95 border border-carolinaBlue/20">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-carolinaBlue/10 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-carolinaBlue" />
          </div>
          <DialogTitle className="text-2xl font-bold text-chineseBlack">
            Welcome to Your Safe Space
          </DialogTitle>
          <DialogDescription className="text-chineseBlack/70 text-base">
            To provide you with a more personalized experience, please tell us your name. 
            This helps our AI therapist address you properly during your sessions.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-chineseBlack font-medium">
              What should we call you?
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-chineseBlack/50" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 bg-brightGray/50 border-carolinaBlue/30 text-chineseBlack placeholder:text-chineseBlack/50 focus:border-carolinaBlue"
                autoFocus
                disabled={isLoading}
              />
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-carolinaBlue hover:bg-carolinaBlue/90 text-brightGray font-medium py-3"
            disabled={!name.trim() || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-brightGray/30 border-t-brightGray rounded-full animate-spin" />
                Starting your session...
              </div>
            ) : (
              "Start My Session"
            )}
          </Button>
        </form>
        
        <div className="text-center text-sm text-chineseBlack/60">
          <p>Your name is stored locally and will be used to personalize your AI therapy experience.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;


