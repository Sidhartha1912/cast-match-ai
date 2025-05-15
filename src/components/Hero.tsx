
import React from 'react';
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="py-16 md:py-24 cinematic-bg text-white">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Find Your Perfect Cast with AI
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            The AI-powered casting assistant that helps directors instantly visualize characters and match them with the perfect actors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" className="bg-castmatch-purple hover:bg-castmatch-lightPurple text-white">
              <a href="#tool">Try the Tool Now</a>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              View Sample Report
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
