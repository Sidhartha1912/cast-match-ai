
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image } from 'lucide-react';

type CandidateUploadProps = {
  onUpload: (candidates: any[]) => void;
};

const CandidateUpload = ({ onUpload }: CandidateUploadProps) => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [currentCandidate, setCurrentCandidate] = useState({
    name: '',
    images: [] as File[],
    previewUrls: [] as string[]
  });

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files);
      const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
      
      setCurrentCandidate(prev => ({
        ...prev,
        images: [...prev.images, ...newImages],
        previewUrls: [...prev.previewUrls, ...newPreviewUrls]
      }));
    }
  }, []);

  const removeImage = (index: number) => {
    setCurrentCandidate(prev => {
      const newImages = [...prev.images];
      const newPreviewUrls = [...prev.previewUrls];
      
      // Revoke the URL to avoid memory leaks
      URL.revokeObjectURL(newPreviewUrls[index]);
      
      newImages.splice(index, 1);
      newPreviewUrls.splice(index, 1);
      
      return {
        ...prev,
        images: newImages,
        previewUrls: newPreviewUrls
      };
    });
  };

  const addCandidate = () => {
    if (currentCandidate.name.trim() === '' || currentCandidate.images.length === 0) {
      return;
    }
    
    setCandidates(prev => [...prev, { ...currentCandidate }]);
    setCurrentCandidate({
      name: '',
      images: [],
      previewUrls: []
    });
  };

  const removeCandidate = (index: number) => {
    setCandidates(prev => {
      const newCandidates = [...prev];
      
      // Revoke all URLs for this candidate
      newCandidates[index].previewUrls.forEach((url: string) => URL.revokeObjectURL(url));
      
      newCandidates.splice(index, 1);
      return newCandidates;
    });
  };

  const handleSubmit = () => {
    // Add the current candidate if it has a name and images
    if (currentCandidate.name.trim() !== '' && currentCandidate.images.length > 0) {
      addCandidate();
    }
    
    onUpload(candidates);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Step 2: Upload Candidate Photos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Add New Candidate</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="candidateName">Candidate Name</Label>
                <Input
                  id="candidateName"
                  value={currentCandidate.name}
                  onChange={(e) => setCurrentCandidate(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter candidate name"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Upload Images</Label>
                <div className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => document.getElementById('imageUpload')?.click()}>
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Drag & drop or click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">Support for multiple images</p>
                  </div>
                  <Input
                    id="imageUpload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {currentCandidate.previewUrls.length > 0 && (
                <div>
                  <Label>Preview</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                    {currentCandidate.previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <Button
                type="button"
                variant="outline"
                onClick={addCandidate}
                disabled={currentCandidate.name.trim() === '' || currentCandidate.images.length === 0}
              >
                Add Candidate
              </Button>
            </div>
          </div>

          {candidates.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Added Candidates</h3>
              <div className="space-y-4">
                {candidates.map((candidate, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{candidate.name}</h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeCandidate(index)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {candidate.previewUrls.map((url: string, imgIndex: number) => (
                        <img
                          key={imgIndex}
                          src={url}
                          alt={`${candidate.name} ${imgIndex + 1}`}
                          className="h-20 w-full object-cover rounded-md"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            className="w-full bg-castmatch-purple hover:bg-castmatch-deepPurple"
            onClick={handleSubmit}
            disabled={candidates.length === 0}
          >
            Submit Candidates
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateUpload;
