import { Button } from "@/components/ui/button";
import { MessageSquare, Github } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-hero overflow-hidden">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-8 animate-fade-up">
          <div className="inline-block">
            <div className="text-sm font-semibold text-primary mb-2 tracking-wider uppercase">
              AI-Powered Translation
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
            Welcome to{" "}
            <span className=" animate-float">
              GAI
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Bridge language barriers with AI. Translate seamlessly between{" "}
            <span className="font-semibold text-foreground">English</span>,{" "}
            <span className="font-semibold text-foreground">Pidgin</span>,{" "}
            <span className="font-semibold text-foreground">Yoruba</span>,{" "}
            <span className="font-semibold text-foreground">Igbo</span>, and{" "}
            <span className="font-semibold text-foreground">Hausa</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
               
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => window.location.href = "/chat"}
            >
              <MessageSquare className="w-5 h-5" />
              Try Chatbox
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6 border-2 hover:border-primary hover:bg-primary/5"
              onClick={() => window.open("https://github.com/yourusername/gai", "_blank")}
            >
              <Github className="w-5 h-5" />
              View GitHub
            </Button>
          </div>
          
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {[
              { name: "English"},
              { name: "Pidgin"},
              { name: "Yoruba" },
              { name: "Igbo" },
              { name: "Hausa"}
            ].map((lang, index) => (
              <div 
                key={lang.name}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border border-border hover:border-primary transition-all duration-300 hover:shadow-soft animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
               
                <span className="text-sm font-medium">{lang.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0" />
    </section>
  );
};

export default Hero;
