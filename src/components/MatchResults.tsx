
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MatchedCandidate } from '@/services/groqCloudService';
import { saveMatchResults } from '@/services/matchResultsService';
import { generateReport } from '@/services/reportService';
import { toast } from '@/hooks/use-toast';
import { Download, RotateCcw } from 'lucide-react';

type MatchResultsProps = {
  characterImage: string;
  candidates: MatchedCandidate[];
  onDownload: () => void;
  onReset: () => void;
  characterData?: any;
};

const MatchResults = ({ 
  characterImage, 
  candidates, 
  onReset, 
  characterData = {}
}: MatchResultsProps) => {
  // Sort candidates by match score (highest first)
  const sortedCandidates = [...candidates].sort((a, b) => b.matchScore - a.matchScore);

  // Save match results to Supabase when component mounts
  useEffect(() => {
    const saveResults = async () => {
      if (candidates.length > 0) {
        const result = await saveMatchResults(
          characterData,
          characterImage,
          candidates
        );
        
        if (!result.success) {
          toast({
            title: "Error Saving Results",
            description: "There was an error saving your match results.",
            variant: "destructive"
          });
        }
      }
    };
    
    saveResults();
  }, [candidates, characterData, characterImage]);

  const handleDownload = async () => {
    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your report..."
      });
      
      const pdfBlob = await generateReport(characterData, characterImage, candidates);
      
      // Create download link and trigger download
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `castmatch-report-${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Report Downloaded",
        description: "Your casting report has been downloaded successfully."
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive"
      });
    }
  };

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
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onReset}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Start New Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchResults;
