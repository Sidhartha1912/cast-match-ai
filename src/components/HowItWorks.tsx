
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    number: 1,
    title: "Create a Character",
    description: "Define your ideal character with AI using simple inputs like gender, age, and style.",
    icon: "✏️"
  },
  {
    number: 2,
    title: "Upload Candidate Photos",
    description: "Upload multiple images of your casting candidates for comparison.",
    icon: "📸"
  },
  {
    number: 3,
    title: "Get a Match Report",
    description: "Receive instant AI analysis with match scores, visual comparisons, and export options.",
    icon: "📊"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our simple 3-step process helps you find the perfect match for your character
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <Card key={step.number} className="cinematic-card">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-castmatch-purple text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl mb-4">{step.icon}</div>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
