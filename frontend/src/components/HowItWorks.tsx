import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Select Languages",
    description: "Choose your source and target language from our supported options.",
  },
  {
    number: "02",
    title: "Type or Speak",
    description: "Enter your text or use voice input for hands-free translation.",
  },
  {
    number: "03",
    title: "Get Translation",
    description: "Receive accurate, context-aware translations instantly.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4 animate-fade-up">
          <h2 className="text-4xl sm:text-5xl font-bold">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, fast, and intuitive translation process
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => {
            return (
              <div key={step.number} className="relative">
                <div className="text-center space-y-4 ">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full  text-primary-foreground font-bold text-2xl mb-4 shadow-glow`}>
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-4 text-primary">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
