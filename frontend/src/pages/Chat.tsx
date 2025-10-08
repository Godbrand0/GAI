import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-hero">
      <div className="max-w-2xl w-full text-center space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
        
        <h1 className="text-4xl sm:text-5xl font-bold">
          <span className="bg-gradient-multicolor bg-clip-text text-transparent">GAI</span> Chatbox
        </h1>
        
        <div className="p-8 rounded-lg bg-card border border-border shadow-soft">
          <p className="text-muted-foreground text-lg">
            The chatbox interface will be implemented here.
          </p>
          <p className="text-muted-foreground mt-4">
            This is where you'll be able to translate between English, Pidgin, Yoruba, Igbo, and Hausa.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
