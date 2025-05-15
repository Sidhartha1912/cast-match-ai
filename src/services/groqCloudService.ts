
import { toast } from "sonner";

interface GroqCloudResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  error?: string;
}

export interface CharacterDescription {
  gender?: string;
  age?: number;
  ethnicity?: string;
  hairstyle?: string;
  hairColor?: string;
  bodyType?: string;
  skinTone?: string;
  facialHair?: string;
  eyeShape?: string;
  eyeColor?: string;
  faceShape?: string;
  noseShape?: string;
  lipShape?: string;
  cheekboneProminence?: number;
  jawlineDefinition?: number;
  skinTexture?: string;
  specialFeatures?: string[];
  jawShape?: string;
  vibe?: string[];
  personalityVibe?: string[];
  characterDescription?: string;
}

export class GroqCloudService {
  private apiKey: string = "";
  private apiUrl: string = "https://api.groq.com/openai/v1/chat/completions";

  constructor(apiKey?: string) {
    if (apiKey) {
      this.apiKey = apiKey;
    } else {
      // For development only - in production would use environment variables
      console.warn("No API key provided for GroqCloud service");
    }
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  async generateCharacterImage(characterData: CharacterDescription): Promise<string> {
    if (!this.apiKey) {
      toast.error("GroqCloud API key is not set");
      return "";
    }

    try {
      const prompt = this.buildCharacterPrompt(characterData);
      
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: "You are a casting assistant AI that helps generate detailed character descriptions for actors and casting directors."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 1024,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to generate character image");
      }

      const data: GroqCloudResponse = await response.json();
      
      // In a real implementation, this would return a URL to an image
      // For now, we'll return a placeholder with the description
      return "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&h=800";
      
    } catch (error) {
      console.error("Error generating character image:", error);
      toast.error("Failed to generate character image");
      throw error;
    }
  }

  async matchCandidates(characterImageUrl: string, candidateImages: string[]): Promise<any[]> {
    if (!this.apiKey) {
      toast.error("GroqCloud API key is not set");
      return [];
    }

    try {
      // In a real implementation, this would send the images to the API for matching
      // For now, we'll return mock data
      return [
        {
          name: "Emma Thompson",
          matchScore: 87,
          image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&h=800",
          matchingTraits: ["Similar facial structure", "Expressive eyes", "Natural presence"]
        },
        {
          name: "Michael Chen",
          matchScore: 72,
          image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&h=800",
          matchingTraits: ["Comparable look", "Strong jawline", "Similar age appearance"]
        },
        {
          name: "Sofia Rodriguez",
          matchScore: 64,
          image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&h=800",
          matchingTraits: ["Compatible vibe", "Similar hair texture", "Matching intensity"]
        }
      ];
    } catch (error) {
      console.error("Error matching candidates:", error);
      toast.error("Failed to match candidates");
      throw error;
    }
  }
  
  private buildCharacterPrompt(characterData: CharacterDescription): string {
    // Build a detailed prompt based on the character data
    const parts: string[] = ["Generate a detailed visual description for a character with the following attributes:"];
    
    if (characterData.gender) parts.push(`Gender: ${characterData.gender}`);
    if (characterData.age) parts.push(`Age: ${characterData.age}`);
    if (characterData.ethnicity) parts.push(`Ethnicity: ${characterData.ethnicity}`);
    if (characterData.skinTone) parts.push(`Skin tone: ${characterData.skinTone}`);
    if (characterData.hairstyle) parts.push(`Hairstyle: ${characterData.hairstyle}`);
    if (characterData.hairColor) parts.push(`Hair color: ${characterData.hairColor}`);
    if (characterData.facialHair) parts.push(`Facial hair: ${characterData.facialHair}`);
    if (characterData.eyeShape) parts.push(`Eye shape: ${characterData.eyeShape}`);
    if (characterData.eyeColor) parts.push(`Eye color: ${characterData.eyeColor}`);
    if (characterData.faceShape) parts.push(`Face shape: ${characterData.faceShape}`);
    if (characterData.noseShape) parts.push(`Nose shape: ${characterData.noseShape}`);
    if (characterData.lipShape) parts.push(`Lip shape: ${characterData.lipShape}`);
    if (characterData.cheekboneProminence) parts.push(`Cheekbone prominence: ${characterData.cheekboneProminence}%`);
    if (characterData.jawlineDefinition) parts.push(`Jawline definition: ${characterData.jawlineDefinition}%`);
    if (characterData.skinTexture) parts.push(`Skin texture: ${characterData.skinTexture}`);
    if (characterData.jawShape) parts.push(`Jaw shape: ${characterData.jawShape}`);
    if (characterData.bodyType) parts.push(`Body type: ${characterData.bodyType}`);
    
    if (characterData.specialFeatures && characterData.specialFeatures.length > 0) {
      parts.push(`Special features: ${characterData.specialFeatures.join(", ")}`);
    }
    
    if (characterData.vibe && characterData.vibe.length > 0) {
      parts.push(`Personality vibes: ${characterData.vibe.join(", ")}`);
    }
    
    if (characterData.personalityVibe && characterData.personalityVibe.length > 0) {
      parts.push(`Additional personality traits: ${characterData.personalityVibe.join(", ")}`);
    }
    
    if (characterData.characterDescription) {
      parts.push(`Character background and description: ${characterData.characterDescription}`);
    }
    
    return parts.join("\n");
  }
}

// Create a singleton instance for use throughout the app
const groqCloudService = new GroqCloudService();
export default groqCloudService;
