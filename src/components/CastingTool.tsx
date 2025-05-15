
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CharacterForm from './CharacterForm';
import CandidateUpload from './CandidateUpload';
import MatchResults from './MatchResults';
import { toast } from "@/components/ui/sonner";

// Temporary placeholder images for demo purposes
const characterImage = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&h=800";
const candidateImages = [
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&h=800",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&h=800",
  "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&h=800",
];

const CastingTool = () => {
  const [activeTab, setActiveTab] = useState('character');
  const [characterData, setCharacterData] = useState<any>(null);
  const [candidatesData, setCandidatesData] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Mock data for demonstration purposes
  const mockResults = {
    characterImage: characterImage,
    candidates: [
      {
        name: "Emma Thompson",
        matchScore: 87,
        image: candidateImages[0],
        matchingTraits: ["Similar facial structure", "Expressive eyes", "Natural presence"]
      },
      {
        name: "Michael Chen",
        matchScore: 72,
        image: candidateImages[1],
        matchingTraits: ["Comparable look", "Strong jawline", "Similar age appearance"]
      },
      {
        name: "Sofia Rodriguez",
        matchScore: 64,
        image: candidateImages[2],
        matchingTraits: ["Compatible vibe", "Similar hair texture", "Matching intensity"]
      }
    ]
  };

  const handleCharacterSubmit = (data: any) => {
    console.log("Character data:", data);
    setCharacterData(data);
    toast.success("Character generated successfully!");
    setActiveTab('candidates');
  };

  const handleCandidatesSubmit = (candidates: any[]) => {
    console.log("Candidates data:", candidates);
    setCandidatesData(candidates);
    toast.success("Processing candidates...");
    
    // Simulate API processing delay
    setTimeout(() => {
      setShowResults(true);
      setActiveTab('results');
    }, 2000);
  };

  const handleDownloadReport = () => {
    toast.success("Downloading report...");
    // In a real application, this would call a service to generate a PDF
    setTimeout(() => {
      toast.success("Report downloaded successfully!");
    }, 2000);
  };

  const handleReset = () => {
    setCharacterData(null);
    setCandidatesData([]);
    setShowResults(false);
    setActiveTab('character');
    toast.info("Started new analysis");
  };

  return (
    <section id="tool" className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">CastMatch.AI Tool</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the perfect actor for your character using our AI-powered casting tool
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="character">1. Character</TabsTrigger>
              <TabsTrigger value="candidates" disabled={!characterData}>2. Candidates</TabsTrigger>
              <TabsTrigger value="results" disabled={!showResults}>3. Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="character">
              <CharacterForm onSubmit={handleCharacterSubmit} />
            </TabsContent>
            
            <TabsContent value="candidates">
              <CandidateUpload onUpload={handleCandidatesSubmit} />
            </TabsContent>
            
            <TabsContent value="results">
              <MatchResults
                characterImage={mockResults.characterImage}
                candidates={mockResults.candidates}
                onDownload={handleDownloadReport}
                onReset={handleReset}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default CastingTool;
