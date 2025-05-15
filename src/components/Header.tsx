
import React from 'react';
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full py-4 border-b">
      <div className="container flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-castmatch-purple">CastMatch.AI</span>
        </a>
        <div className="hidden sm:flex items-center gap-6">
          <Button variant="ghost" asChild>
            <a href="#how-it-works">How It Works</a>
          </Button>
          <Button variant="ghost" asChild>
            <a href="#tool">Try Now</a>
          </Button>
          <Button variant="default" className="bg-castmatch-purple hover:bg-castmatch-deepPurple">
            <a href="#tool">Get Started</a>
          </Button>
        </div>
        <div className="sm:hidden">
          <Button variant="ghost" size="sm">
            <a href="#tool">Start</a>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
