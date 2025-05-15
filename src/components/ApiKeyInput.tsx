
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import groqCloudService from '@/services/groqCloudService';

interface ApiKeyInputProps {
  onKeySet: () => void;
}

const ApiKeyInput = ({ onKeySet }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState<string>("");
  
  const handleSetApiKey = () => {
    if (!apiKey || apiKey.trim() === "") {
      toast.error("Please enter a valid GroqCloud API key");
      return;
    }
    
    groqCloudService.setApiKey(apiKey);
    toast.success("API key set successfully");
    onKeySet();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Set GroqCloud API Key</CardTitle>
        <CardDescription>
          Enter your GroqCloud API key to enable character generation and candidate matching
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <Input
            type="password"
            placeholder="Enter your GroqCloud API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Your API key is stored locally in your browser session and is never sent to our servers.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSetApiKey} 
          className="w-full bg-castmatch-purple hover:bg-castmatch-deepPurple"
        >
          Set API Key
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiKeyInput;
