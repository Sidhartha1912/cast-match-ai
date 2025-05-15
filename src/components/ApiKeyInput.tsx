
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import groqCloudService from '@/services/groqCloudService';

interface ApiKeyInputProps {
  onKeySet: () => void;
}

const ApiKeyInput = ({ onKeySet }: ApiKeyInputProps) => {
  useEffect(() => {
    // Use the provided API key directly
    const apiKey = "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";
    groqCloudService.setApiKey(apiKey);
    toast.success("API key configured successfully");
    onKeySet();
  }, [onKeySet]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>GroqCloud API Integration</CardTitle>
        <CardDescription>
          The application is being configured to connect to GroqCloud AI services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <p>Setting up your AI-powered character generation and candidate matching...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
