import { Github, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-multicolor bg-clip-text text-transparent">
              GAI
            </h3>
            <p className="text-muted-foreground">
              Bridging language barriers with AI-powered translation for African languages.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/chat" className="text-muted-foreground hover:text-primary transition-colors">
                  Try Chatbox
                </a>
              </li>
              <li>
                <a href="https://github.com/yourusername/gai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Connect</h4>
            <div className="flex gap-4">
              <a 
                href="https://github.com/yourusername/gai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/gai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="mailto:contact@gai.com"
                className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} GAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
