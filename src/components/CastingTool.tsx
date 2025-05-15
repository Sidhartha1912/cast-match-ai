
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CharacterForm from './CharacterForm';
import CandidateUpload from './CandidateUpload';
import MatchResults from './MatchResults';
import ApiKeyInput from './ApiKeyInput';
import { toast } from "sonner";
import groqCloudService, { CharacterDescription, MatchedCandidate } from '@/services/groqCloudService';

const CastingTool = () => {
  const [activeTab, setActiveTab] = useState('character');
  const [characterData, setCharacterData] = useState<CharacterDescription | null>(null);
  const [candidatesData, setCandidatesData] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [characterImage, setCharacterImage] = useState<string>("");
  const [matchResults, setMatchResults] = useState<{
    characterImage: string;
    candidates: MatchedCandidate[];
  } | null>(null);

  // Check if API key is already set on component mount
  useEffect(() => {
    // If the groqCloudService already has the API key set in its constructor
    if (groqCloudService.hasApiKey()) {
      setIsApiKeySet(true);
    }
  }, []);

  const handleCharacterSubmit = async (data: CharacterDescription) => {
    console.log("Character data:", data);
    
    if (!isApiKeySet) {
      toast.error("Please wait for GroqCloud API to be configured");
      return;
    }
    
    setCharacterData(data);
    setIsLoading(true);
    
    try {
      const imageUrl = await groqCloudService.generateCharacterImage(data);
      setCharacterImage(imageUrl);
      toast.success("Character generated successfully!");
      setActiveTab('candidates');
    } catch (error) {
      toast.error("Failed to generate character");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCandidatesSubmit = async (candidates: any[]) => {
    console.log("Candidates data:", candidates);
    setCandidatesData(candidates);
    
    if (!characterImage) {
      toast.error("Please generate a character first");
      return;
    }
    
    setIsLoading(true);
    toast.success("Processing candidates...");
    
    try {
      const candidateImageUrls = candidates.map(c => c.image || "");
      const results = await groqCloudService.matchCandidates(characterImage, candidateImageUrls);
      
      // Update the candidate names in the results
      const namedResults = results.map((result, index) => {
        if (index < candidates.length && candidates[index].name) {
          return { ...result, name: candidates[index].name };
        }
        return result;
      });
      
      setMatchResults({
        characterImage: characterImage,
        candidates: namedResults
      });
      
      setShowResults(true);
      setActiveTab('results');
    } catch (error) {
      toast.error("Failed to match candidates");
      console.error("Error matching candidates:", error);
    } finally {
      setIsLoading(false);
    }
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
    setCharacterImage("");
    setMatchResults(null);
    setActiveTab('character');
    toast.info("Started new analysis");
  };

  const handleApiKeySet = () => {
    setIsApiKeySet(true);
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
          {!isApiKeySet ? (
            <ApiKeyInput onKeySet={handleApiKeySet} />
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="character">1. Character</TabsTrigger>
                <TabsTrigger value="candidates" disabled={!characterData}>2. Candidates</TabsTrigger>
                <TabsTrigger value="results" disabled={!showResults}>3. Results</TabsTrigger>
              </TabsList>
              
              <TabsContent value="character">
                <CharacterForm onSubmit={handleCharacterSubmit} isLoading={isLoading} />
              </TabsContent>
              
              <TabsContent value="candidates">
                <CandidateUpload onUpload={handleCandidatesSubmit} isLoading={isLoading} />
              </TabsContent>
              
              <TabsContent value="results">
                <MatchResults
                  characterImage={matchResults?.characterImage || ""}
                  candidates={matchResults?.candidates || []}
                  onDownload={handleDownloadReport}
                  onReset={handleReset}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </section>
  );
};

export default CastingTool;
