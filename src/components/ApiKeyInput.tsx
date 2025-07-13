
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import groqCloudService from '@/services/groqCloudService';

interface ApiKeyInputProps {
  onKeySet: () => void;
}

const ApiKeyInput = ({ onKeySet }: ApiKeyInputProps) => {
  useEffect(() => {
    // Use the updated API key directly
    const apiKey = "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";
    groqCloudService.setApiKey(apiKey);
    toast.success("API key configured successfully with meta-llama/llama-4-scout-17b-16e-instruct model");
    onKeySet();
  }, [onKeySet]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>GroqCloud API Integration</CardTitle>
        <CardDescription>
          The application is configured to use meta-llama/llama-4-scout-17b-16e-instruct model for AI-powered character generation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <p>Setting up your AI-powered character generation and candidate matching with the latest Llama model...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
