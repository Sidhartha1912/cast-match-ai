
import React, { useState } from 'react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';

// Define all dropdown options
const genderOptions = ['Male', 'Female', 'Non-binary'];
const ethnicityOptions = ['Caucasian', 'Black/African', 'Hispanic/Latino', 'Asian', 'Middle Eastern', 'South Asian', 'Mixed', 'Other'];
const hairstyleOptions = ['Short', 'Medium', 'Long', 'Bald', 'Curly', 'Straight', 'Wavy', 'Afro', 'Buzzcut', 'Other'];
const bodyTypeOptions = ['Slim', 'Athletic', 'Average', 'Muscular', 'Plus Size', 'Petite', 'Tall'];
const vibeOptions = ['Friendly', 'Serious', 'Mysterious', 'Energetic', 'Calm', 'Intense', 'Whimsical', 'Professional'];

// New field options
const skinToneOptions = ['Very Fair', 'Fair', 'Wheatish', 'Olive', 'Brown', 'Dark', 'Custom'];
const hairColorOptions = ['Black', 'Brown', 'Blonde', 'Red', 'Grey', 'Dyed (Pink)', 'Dyed (Blue)', 'Dyed (Other)'];
const facialHairOptions = ['Clean-shaven', 'Beard (Full)', 'Beard (Patchy)', 'Mustache', 'Stubble', 'None'];
const eyeShapeOptions = ['Almond', 'Round', 'Hooded', 'Monolid', 'Droopy'];
const eyeColorOptions = ['Black', 'Brown', 'Hazel', 'Blue', 'Green', 'Grey'];
const faceShapeOptions = ['Oval', 'Round', 'Square', 'Heart', 'Diamond', 'Triangle', 'Long/Rectangular'];
const noseShapeOptions = ['Straight', 'Roman', 'Button', 'Aquiline', 'Snub', 'Hooked', 'Wide', 'Narrow'];
const lipShapeOptions = ['Full', 'Thin', 'Heart-shaped', 'Bow-shaped', 'Downturned'];
const skinTextureOptions = ['Smooth', 'Freckled', 'Wrinkled', 'Acne-prone', 'Blemished'];
const jawShapeOptions = ['Round', 'Angular', 'Square', 'Tapered'];
const specialFeaturesOptions = [
  { id: 'freckles', label: 'Freckles' },
  { id: 'birthmark', label: 'Birthmark' },
  { id: 'beautyMark', label: 'Beauty Mark' },
  { id: 'scar', label: 'Scar' },
  { id: 'mole', label: 'Mole' },
  { id: 'wrinkles', label: 'Wrinkles' },
  { id: 'dimple', label: 'Dimple' },
  { id: 'laughLines', label: 'Laugh Lines' }
];
const personalityVibeOptions = ['Charming', 'Villainous', 'Innocent', 'Tough', 'Mysterious', 'Intellectual', 'Funny', 'Flirtatious', 'Melancholic', 'Authority Figure'];

type CharacterFormProps = {
  onSubmit: (data: any) => void;
};

const CharacterForm = ({ onSubmit }: CharacterFormProps) => {
  const form = useForm({
    defaultValues: {
      gender: '',
      ageRange: [30],
      ethnicity: '',
      hairstyle: '',
      bodyType: '',
      vibe: [],
      // New fields
      skinTone: '',
      hairColor: '',
      facialHair: '',
      eyeShape: '',
      eyeColor: '',
      faceShape: '',
      noseShape: '',
      lipShape: '',
      cheekboneProminence: [50],
      jawlineDefinition: [50],
      skinTexture: '',
      specialFeatures: [],
      jawShape: '',
      personalityVibe: [],
      characterDescription: '',
    },
  });

  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedPersonalityVibes, setSelectedPersonalityVibes] = useState<string[]>([]);
  const [selectedSpecialFeatures, setSelectedSpecialFeatures] = useState<string[]>([]);

  const toggleVibe = (vibe: string) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter(v => v !== vibe));
    } else if (selectedVibes.length < 3) {
      setSelectedVibes([...selectedVibes, vibe]);
    }
    form.setValue('vibe', selectedVibes);
  };

  const togglePersonalityVibe = (vibe: string) => {
    if (selectedPersonalityVibes.includes(vibe)) {
      setSelectedPersonalityVibes(selectedPersonalityVibes.filter(v => v !== vibe));
    } else if (selectedPersonalityVibes.length < 3) {
      setSelectedPersonalityVibes([...selectedPersonalityVibes, vibe]);
    }
    form.setValue('personalityVibe', selectedPersonalityVibes);
  };

  const toggleSpecialFeature = (feature: string) => {
    if (selectedSpecialFeatures.includes(feature)) {
      setSelectedSpecialFeatures(selectedSpecialFeatures.filter(f => f !== feature));
    } else {
      setSelectedSpecialFeatures([...selectedSpecialFeatures, feature]);
    }
    form.setValue('specialFeatures', selectedSpecialFeatures);
  };

  const handleSubmit = (data: any) => {
    data.vibe = selectedVibes;
    data.personalityVibe = selectedPersonalityVibes;
    data.specialFeatures = selectedSpecialFeatures;
    onSubmit(data);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Step 1: Create Your Character</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genderOptions.map(gender => (
                          <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ethnicity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ethnicity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ethnicity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ethnicityOptions.map(ethnicity => (
                          <SelectItem key={ethnicity} value={ethnicity}>{ethnicity}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="ageRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={18}
                      max={80}
                      step={1}
                      defaultValue={[30]}
                      onValueChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="hairstyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hairstyle</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select hairstyle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hairstyleOptions.map(hairstyle => (
                          <SelectItem key={hairstyle} value={hairstyle}>{hairstyle}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hairColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hair Color</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select hair color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hairColorOptions.map(color => (
                          <SelectItem key={color} value={color}>{color}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="bodyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select body type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bodyTypeOptions.map(bodyType => (
                          <SelectItem key={bodyType} value={bodyType}>{bodyType}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skinTone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skin Tone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select skin tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {skinToneOptions.map(tone => (
                          <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="facialHair"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facial Hair</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select facial hair" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {facialHairOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eyeShape"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eye Shape</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select eye shape" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {eyeShapeOptions.map(shape => (
                          <SelectItem key={shape} value={shape}>{shape}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="eyeColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eye Color</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select eye color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {eyeColorOptions.map(color => (
                          <SelectItem key={color} value={color}>{color}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="faceShape"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Face Shape</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select face shape" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {faceShapeOptions.map(shape => (
                          <SelectItem key={shape} value={shape}>{shape}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="noseShape"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nose Shape</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select nose shape" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {noseShapeOptions.map(shape => (
                          <SelectItem key={shape} value={shape}>{shape}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lipShape"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lip Shape</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select lip shape" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {lipShapeOptions.map(shape => (
                          <SelectItem key={shape} value={shape}>{shape}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cheekboneProminence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cheekbone Prominence: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      defaultValue={[50]}
                      onValueChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Subtle</span>
                    <span>High</span>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jawlineDefinition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jawline Definition: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      defaultValue={[50]}
                      onValueChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Soft</span>
                    <span>Sharp</span>
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="skinTexture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skin Texture</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select skin texture" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {skinTextureOptions.map(texture => (
                          <SelectItem key={texture} value={texture}>{texture}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jawShape"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jaw Shape</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select jaw shape" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jawShapeOptions.map(shape => (
                          <SelectItem key={shape} value={shape}>{shape}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="specialFeatures"
              render={() => (
                <FormItem>
                  <FormLabel>Special Features (select multiple)</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {specialFeaturesOptions.map((feature) => (
                      <div key={feature.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={feature.id} 
                          checked={selectedSpecialFeatures.includes(feature.id)}
                          onCheckedChange={() => toggleSpecialFeature(feature.id)}
                        />
                        <label
                          htmlFor={feature.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {feature.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vibe"
              render={() => (
                <FormItem>
                  <FormLabel>Vibe/Personality (select up to 3)</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {vibeOptions.map(vibe => (
                      <Button
                        key={vibe}
                        type="button"
                        variant={selectedVibes.includes(vibe) ? "default" : "outline"}
                        className={selectedVibes.includes(vibe) ? "bg-castmatch-purple" : ""}
                        onClick={() => toggleVibe(vibe)}
                      >
                        {vibe}
                      </Button>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personalityVibe"
              render={() => (
                <FormItem>
                  <FormLabel>Personality Vibe (select up to 3)</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {personalityVibeOptions.map(vibe => (
                      <Button
                        key={vibe}
                        type="button"
                        variant={selectedPersonalityVibes.includes(vibe) ? "default" : "outline"}
                        className={selectedPersonalityVibes.includes(vibe) ? "bg-castmatch-purple" : ""}
                        onClick={() => togglePersonalityVibe(vibe)}
                      >
                        {vibe}
                      </Button>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="characterDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Character Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your character's personality, background, or any other details that will help in generating an accurate representation"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide details about your character to help generate a more accurate representation.
                  </FormDescription>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-castmatch-purple hover:bg-castmatch-deepPurple">
              Generate Character
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CharacterForm;
