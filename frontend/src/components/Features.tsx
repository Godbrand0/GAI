import { Languages, Zap, Shield, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
            const gradients = [
              "bg-gradient-primary",
              "bg-gradient-secondary", 
              "bg-gradient-to-br from-accent-red to-accent-yellow",
              "bg-gradient-multicolor"
            ];
            return (
              <Card 
                key={feature.title}
                className="border-border hover:border-primary transition-all duration-300 hover:shadow-soft animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${gradients[index]} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
