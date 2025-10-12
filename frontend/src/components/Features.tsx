import { Languages, Zap, Shield, Sparkles } from "lucide-react";

const features = [
  {
    icon: Languages,
    title: "Multi-Language Support",
    description: "Seamlessly translate between English, Pidgin, Yoruba, Igbo, and Hausa with high accuracy.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get instant translations powered by advanced AI models for real-time communication.",
  },
  {
    icon: Shield,
    title: "Privacy Focused",
    description: "Your conversations are secure. We prioritize your privacy and data protection.",
  },
  {
    icon: Sparkles,
    title: "Context Aware",
    description: "AI understands context and nuances, providing natural and culturally appropriate translations.",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4 animate-fade-up">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Why Choose{" "}
            <span className="bg-gradient-multicolor bg-clip-text text-transparent">GAI</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make language translation effortless and accurate
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {

            return (
              <div
                key={feature.title}
                className="rounded-lg border border-border bg-card text-card-foreground shadow-sm hover:border-primary transition-all duration-300 hover:shadow-soft animate-fade-up p-6"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col space-y-1.5 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">{feature.title}</h3>
                </div>
                <div>
                  <p className="text-base text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
