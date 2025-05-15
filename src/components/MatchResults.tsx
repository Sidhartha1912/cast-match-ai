
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MatchedCandidate } from '@/services/groqCloudService';

type MatchResultsProps = {
  characterImage: string;
  candidates: MatchedCandidate[];
  onDownload: () => void;
  onReset: () => void;
};

const MatchResults = ({ characterImage, candidates, onDownload, onReset }: MatchResultsProps) => {
  // Sort candidates by match score (highest first)
  const sortedCandidates = [...candidates].sort((a, b) => b.matchScore - a.matchScore);

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl">Step 3: Match Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-medium mb-4">Generated Character</h3>
            <div className="border rounded-md p-2">
              <img
                src={characterImage}
                alt="Generated Character"
                className="w-full aspect-square object-cover rounded-md"
              />
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <h3 className="text-lg font-medium mb-4">Top Matching Candidates</h3>
            {sortedCandidates.length === 0 ? (
              <div className="text-center py-8 border rounded-md">
                <p className="text-muted-foreground">No matching candidates found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedCandidates.map((candidate, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="sm:w-1/4">
                        <img
                          src={candidate.image}
                          alt={candidate.name}
                          className="w-full aspect-square object-cover rounded-md"
                        />
                      </div>
                      <div className="sm:w-3/4 space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{candidate.name}</h4>
                          <span className="text-lg font-bold text-castmatch-purple">
                            {candidate.matchScore}%
                          </span>
                        </div>
                        
                        <Progress value={candidate.matchScore} className="h-2" />
                        
                        <div>
                          <p className="text-sm font-medium mb-1">Matching Traits:</p>
                          <div className="flex flex-wrap gap-1">
                            {candidate.matchingTraits.map((trait, i) => (
                              <span
                                key={i}
                                className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                              >
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="bg-castmatch-purple hover:bg-castmatch-deepPurple flex-1"
            onClick={onDownload}
          >
            Download Report
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onReset}
          >
            Start New Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchResults;
