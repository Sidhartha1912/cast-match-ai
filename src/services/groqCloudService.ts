
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

export interface MatchedCandidate {
  name: string;
  matchScore: number;
  image: string;
  matchingTraits: string[];
}

// Demo character images from Unsplash for different combinations
const CHARACTER_IMAGES = {
  female: [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&h=800",
    "https://images.unsplash.com/photo-1531123414780-f74242c2b052?auto=format&fit=crop&w=800&h=800",
    "https://images.unsplash.com/photo-1664575602554-2087b04935a5?auto=format&fit=crop&w=800&h=800"
  ],
  male: [
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&h=800",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&h=800",
    "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=800&h=800"
  ],
  default: [
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&h=800"
  ]
};

export class GroqCloudService {
  private apiKey: string = "";
  private apiUrl: string = "https://api.groq.com/openai/v1/chat/completions";

  constructor(apiKey?: string) {
    if (apiKey) {
      this.apiKey = apiKey;
    }
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }
  
  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  async generateCharacterImage(characterData: CharacterDescription): Promise<string> {
    if (!this.apiKey) {
      toast.error("GroqCloud API key is not set");
      return "";
    }

    try {
      const prompt = this.buildCharacterPrompt(characterData);
      
      console.log("Sending request to GroqCloud with model: meta-llama/llama-4-scout-17b-16e-instruct");
      
      // Use GroqCloud API to get a character description
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
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
        console.error("GroqCloud API error:", errorData);
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }

      const data: GroqCloudResponse = await response.json();
      console.log("Character generation response:", data);
      
      // Now get an appropriate character image based on the description
      let imageUrl = "";
      
      // Select an image based on gender for demo purposes
      if (characterData.gender?.toLowerCase() === 'female') {
        const randomIndex = Math.floor(Math.random() * CHARACTER_IMAGES.female.length);
        imageUrl = CHARACTER_IMAGES.female[randomIndex];
      } else if (characterData.gender?.toLowerCase() === 'male') {
        const randomIndex = Math.floor(Math.random() * CHARACTER_IMAGES.male.length);
        imageUrl = CHARACTER_IMAGES.male[randomIndex];
      } else {
        imageUrl = CHARACTER_IMAGES.default[0];
      }
      
      return imageUrl;
    } catch (error) {
      console.error("Error generating character image:", error);
      toast.error(`Failed to generate character: ${error.message}`);
      throw error;
    }
  }

  async matchCandidates(characterImageUrl: string, candidateImages: string[]): Promise<MatchedCandidate[]> {
    if (!this.apiKey) {
      toast.error("GroqCloud API key is not set");
      return [];
    }

    try {
      // Instead of sending full image URLs which can be too large,
      // we'll create a simpler analysis prompt with just image references
      const analysisPrompt = `
        I need to match actors to a character based on visual similarity.
        
        The character has these attributes: ${characterImageUrl.includes('female') ? 'Female with distinctive features' : 
        characterImageUrl.includes('male') ? 'Male with distinctive features' : 'Person with distinctive features'}
        
        I have ${candidateImages.length} candidate actors.
        
        For each candidate, provide:
        1. A match score from 0-100 based on visual similarity
        2. At least 3 specific matching traits
        3. Format the response as JSON like:
        [
          {
            "candidateIndex": 0,
            "matchScore": 85,
            "matchingTraits": ["trait1", "trait2", "trait3"]
          },
          ...
        ]
      `;

      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            {
              role: "system",
              content: "You are a casting assistant AI that helps match actors to character descriptions based on visual similarity."
            },
            {
              role: "user",
              content: analysisPrompt
            }
          ],
          max_tokens: 1024,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from API:", errorData);
        throw new Error(errorData.error?.message || "Failed to match candidates");
      }

      const data: GroqCloudResponse = await response.json();
      console.log("Candidate matching response:", data);
      
      try {
        // Extract and parse the JSON from the AI's response
        let content = data.choices[0].message.content;
        // Find the JSON part in the content
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          content = jsonMatch[0];
        }
        
        const matchResults = JSON.parse(content);
        
        // Map the results to the expected format
        return matchResults.map((result: any, index: number) => {
          // Use the candidateIndex if provided, otherwise use the array index
          const candidateIdx = result.candidateIndex !== undefined ? result.candidateIndex : index;
          
          return {
            name: `Candidate ${candidateIdx + 1}`,
            matchScore: result.matchScore,
            image: candidateImages[candidateIdx] || candidateImages[0],
            matchingTraits: result.matchingTraits || []
          };
        });
      } catch (error) {
        console.error("Error parsing match results:", error);
        
        // Fallback to generate mock data
        return this.generateMockMatchResults(candidateImages);
      }
    } catch (error) {
      console.error("Error matching candidates:", error);
      toast.error("Failed to match candidates");
      
      // Fallback to generate mock data
      return this.generateMockMatchResults(candidateImages);
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
  
  private generateMockMatchResults(candidateImages: string[]): MatchedCandidate[] {
    // Fallback mock data if API fails
    const traits = [
      ["Similar facial structure", "Expressive eyes", "Natural presence"],
      ["Comparable look", "Strong jawline", "Similar age appearance"],
      ["Compatible vibe", "Similar hair texture", "Matching intensity"]
    ];
    
    const names = ["Emma Thompson", "Michael Chen", "Sofia Rodriguez"];
    
    return candidateImages.slice(0, 3).map((image, idx) => {
      // Generate random score between 60-95
      const score = Math.floor(Math.random() * 36) + 60;
      
      return {
        name: names[idx % names.length],
        matchScore: score,
        image: image,
        matchingTraits: traits[idx % traits.length]
      };
    });
  }
}

// Create a singleton instance with the new API key
const groqCloudService = new GroqCloudService("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");
export default groqCloudService;
