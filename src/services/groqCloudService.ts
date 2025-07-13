
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

  async matchCandidates(characterImageUrl: string, candidateImages: string[], characterData?: CharacterDescription): Promise<MatchedCandidate[]> {
    if (!this.apiKey) {
      toast.error("GroqCloud API key is not set");
      return [];
    }

    // Since the current Groq model doesn't support actual image analysis,
    // we'll implement a more realistic scoring system that uses character data
    return this.analyzeImageMatching(characterImageUrl, candidateImages, characterData);
  }

  private analyzeImageMatching(characterImageUrl: string, candidateImages: string[], characterData?: CharacterDescription): MatchedCandidate[] {
    // Determine character type from URL patterns
    const isCharacterRealistic = this.isRealisticPhoto(characterImageUrl);
    
    return candidateImages.map((candidateImage, index) => {
      const isCandidateRealistic = this.isRealisticPhoto(candidateImage);
      
      // Base scoring on image type compatibility
      let baseScore = 0;
      let matchingTraits: string[] = [];
      
      if (isCharacterRealistic && isCandidateRealistic) {
        // Both are realistic photos - analyze character features for matching
        baseScore = this.calculateFeatureMatchScore(characterData);
        matchingTraits = this.getMatchingTraits(characterData, index);
      } else if (!isCharacterRealistic && !isCandidateRealistic) {
        // Both are non-realistic (animations, cartoons) - moderate match
        baseScore = Math.floor(Math.random() * 30) + 40; // 40-70
        matchingTraits = ["Similar art style", "Animated features", "Stylized appearance"];
      } else {
        // Mixed types (realistic vs animated) - very low match
        baseScore = Math.floor(Math.random() * 15) + 5; // 5-20
        matchingTraits = ["Different visual styles", "Incompatible mediums", "Style mismatch"];
      }
      
      // Add some variation for randomness
      const variation = Math.floor(Math.random() * 10) - 5; // -5 to +5
      const finalScore = Math.max(0, Math.min(100, baseScore + variation));
      
      return {
        name: `Candidate ${index + 1}`,
        matchScore: finalScore,
        image: candidateImage,
        matchingTraits: matchingTraits
      };
    });
  }

  private calculateFeatureMatchScore(characterData?: CharacterDescription): number {
    if (!characterData) {
      return Math.floor(Math.random() * 40) + 30; // 30-70 default
    }
    
    // Calculate score based on how many features are specified
    const features = [
      characterData.gender,
      characterData.ethnicity,
      characterData.age,
      characterData.hairstyle,
      characterData.hairColor,
      characterData.eyeShape,
      characterData.eyeColor,
      characterData.faceShape,
      characterData.noseShape,
      characterData.lipShape,
      characterData.skinTone,
      characterData.facialHair,
      characterData.bodyType
    ].filter(feature => feature && feature !== '');
    
    // More specific features = lower match probability (more constraints)
    const specificity = features.length;
    let baseScore;
    
    if (specificity <= 3) {
      baseScore = Math.floor(Math.random() * 30) + 60; // 60-90
    } else if (specificity <= 6) {
      baseScore = Math.floor(Math.random() * 30) + 40; // 40-70
    } else if (specificity <= 9) {
      baseScore = Math.floor(Math.random() * 25) + 25; // 25-50
    } else {
      baseScore = Math.floor(Math.random() * 20) + 10; // 10-30
    }
    
    return baseScore;
  }

  private getMatchingTraits(characterData?: CharacterDescription, candidateIndex?: number): string[] {
    if (!characterData) {
      return ["Generic match"];
    }
    
    // Collect all selected traits (only non-empty values)
    const allAvailableTraits: string[] = [];
    
    if (characterData.gender) allAvailableTraits.push(`${characterData.gender} appearance`);
    if (characterData.ethnicity) allAvailableTraits.push(`${characterData.ethnicity} features`);
    if (characterData.age) allAvailableTraits.push(`Age range: ${characterData.age}`);
    if (characterData.eyeColor) allAvailableTraits.push(`${characterData.eyeColor} eyes`);
    if (characterData.hairColor) allAvailableTraits.push(`${characterData.hairColor} hair`);
    if (characterData.faceShape) allAvailableTraits.push(`${characterData.faceShape} face shape`);
    if (characterData.bodyType) allAvailableTraits.push(`${characterData.bodyType} build`);
    if (characterData.skinTone) allAvailableTraits.push(`${characterData.skinTone} skin tone`);
    if (characterData.hairstyle) allAvailableTraits.push(`${characterData.hairstyle} hairstyle`);
    if (characterData.eyeShape) allAvailableTraits.push(`${characterData.eyeShape} eye shape`);
    if (characterData.noseShape) allAvailableTraits.push(`${characterData.noseShape} nose shape`);
    if (characterData.lipShape) allAvailableTraits.push(`${characterData.lipShape} lips`);
    if (characterData.facialHair && characterData.facialHair !== 'Clean-shaven' && characterData.facialHair !== 'None') {
      allAvailableTraits.push(`${characterData.facialHair.toLowerCase()}`);
    }
    if (characterData.jawShape) allAvailableTraits.push(`${characterData.jawShape} jaw`);
    if (characterData.skinTexture) allAvailableTraits.push(`${characterData.skinTexture} skin`);
    
    // Add special features if any are selected
    if (characterData.specialFeatures && characterData.specialFeatures.length > 0) {
      characterData.specialFeatures.forEach(feature => {
        allAvailableTraits.push(feature.toLowerCase());
      });
    }
    
    // Add personality vibes if any are selected
    if (characterData.vibe && characterData.vibe.length > 0) {
      characterData.vibe.forEach(vibe => {
        allAvailableTraits.push(`${vibe.toLowerCase()} vibe`);
      });
    }
    
    if (characterData.personalityVibe && characterData.personalityVibe.length > 0) {
      characterData.personalityVibe.forEach(vibe => {
        allAvailableTraits.push(`${vibe.toLowerCase()} personality`);
      });
    }
    
    // If no traits available, return generic
    if (allAvailableTraits.length === 0) {
      return ["Generic match"];
    }
    
    // Randomly select 2-4 traits for this specific candidate
    // Use candidateIndex as seed for consistent but different results per candidate
    const seed = candidateIndex || 0;
    const shuffledTraits = this.shuffleArrayWithSeed([...allAvailableTraits], seed);
    const numTraits = Math.min(Math.floor(Math.random() * 3) + 2, shuffledTraits.length); // 2-4 traits
    
    return shuffledTraits.slice(0, numTraits);
  }

  // Simple seeded shuffle to ensure different but consistent results per candidate
  private shuffleArrayWithSeed<T>(array: T[], seed: number): T[] {
    const shuffled = [...array];
    let m = shuffled.length;
    let t: T;
    let i: number;

    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor((seed * 9301 + 49297) % 233280 / 233280 * m--);
      seed = (seed * 9301 + 49297) % 233280;

      // And swap it with the current element.
      t = shuffled[m];
      shuffled[m] = shuffled[i];
      shuffled[i] = t;
    }

    return shuffled;
  }

  private isRealisticPhoto(imageUrl: string): boolean {
    // Check if the image URL suggests it's from a realistic photo source
    const realisticSources = [
      'unsplash.com',
      'pexels.com',
      'pixabay.com',
      'shutterstock.com',
      'getty',
      'adobe',
      'blob.core.windows.net', // User uploaded photos often end up here
      'amazonaws.com', // S3 storage often used for user photos
      'cloudinary.com'
    ];
    
    // Check for common photo file patterns
    const photoPatterns = [
      /photo/i,
      /portrait/i,
      /headshot/i,
      /professional/i
    ];
    
    // Check for animation/cartoon patterns
    const animationPatterns = [
      /cartoon/i,
      /anime/i,
      /character/i,
      /3d.?render/i,
      /animated/i,
      /avatar/i,
      /game/i
    ];
    
    // First check if it's clearly animated
    if (animationPatterns.some(pattern => pattern.test(imageUrl))) {
      return false;
    }
    
    // Then check if it's from a realistic source
    if (realisticSources.some(source => imageUrl.includes(source))) {
      return true;
    }
    
    // Check for photo patterns
    if (photoPatterns.some(pattern => pattern.test(imageUrl))) {
      return true;
    }
    
    // Default to realistic if we can't determine (err on the side of caution)
    return true;
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
