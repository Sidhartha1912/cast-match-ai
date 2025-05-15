
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

type CandidateUploadProps = {
  onUpload: (candidates: any[]) => void;
  isLoading?: boolean;
};

const CandidateUpload = ({ onUpload, isLoading = false }: CandidateUploadProps) => {
  const [candidates, setCandidates] = useState<any[]>([
    { id: 1, name: "Candidate 1", file: null, image: null },
    { id: 2, name: "Candidate 2", file: null, image: null },
    { id: 3, name: "Candidate 3", file: null, image: null },
  ]);

  const handleNameChange = (id: number, name: string) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === id ? { ...candidate, name } : candidate
    ));
  };

  const handleFileChange = (id: number, file: File | null) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setCandidates(candidates.map(candidate => 
        candidate.id === id ? { ...candidate, file, image: e.target?.result } : candidate
      ));
    };
    reader.readAsDataURL(file);
  };

  const addCandidate = () => {
    const newId = Math.max(0, ...candidates.map(c => c.id)) + 1;
    setCandidates([...candidates, { id: newId, name: `Candidate ${newId}`, file: null, image: null }]);
  };

  const removeCandidate = (id: number) => {
    setCandidates(candidates.filter(candidate => candidate.id !== id));
  };

  const handleSubmit = () => {
    const validCandidates = candidates.filter(c => c.file && c.image);
    if (validCandidates.length === 0) {
      alert("Please upload at least one candidate image.");
      return;
    }
    
    // Use placeholder images for demo if no real images uploaded
    if (validCandidates.length < 3) {
      const placeholders = [
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&h=800",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&h=800",
        "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&h=800",
      ];
      
      // Fill in missing candidates with placeholders
      while (validCandidates.length < 3) {
        const idx = validCandidates.length;
        validCandidates.push({
          id: idx + 100,
          name: `Demo Candidate ${idx + 1}`,
          file: null,
          image: placeholders[idx % placeholders.length]
        });
      }
    }
    
    onUpload(validCandidates);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Step 2: Upload Candidates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="p-4 border rounded-md space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor={`name-${candidate.id}`}>Name</Label>
                {candidates.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeCandidate(candidate.id)}
                  >
                    Remove
                  </Button>
                )}
              </div>
              
              <Input
                id={`name-${candidate.id}`}
                value={candidate.name}
                onChange={(e) => handleNameChange(candidate.id, e.target.value)}
                className="mb-3"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`file-${candidate.id}`}>Upload Photo</Label>
                  <Input
                    id={`file-${candidate.id}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(candidate.id, e.target.files?.[0] || null)}
                    className="mt-1"
                  />
                </div>
                {candidate.image && (
                  <div className="flex justify-center items-center">
                    <img
                      src={candidate.image}
                      alt={candidate.name}
                      className="h-24 w-24 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          <div className="flex flex-col md:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={addCandidate}
              className="flex-1"
            >
              Add Another Candidate
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-castmatch-purple hover:bg-castmatch-deepPurple flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Match Candidates"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateUpload;
