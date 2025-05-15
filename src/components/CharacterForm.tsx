
import React, { useState } from 'react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';

const genderOptions = ['Male', 'Female', 'Non-binary'];
const ethnicityOptions = ['Caucasian', 'Black/African', 'Hispanic/Latino', 'Asian', 'Middle Eastern', 'South Asian', 'Mixed', 'Other'];
const hairstyleOptions = ['Short', 'Medium', 'Long', 'Bald', 'Curly', 'Straight', 'Wavy', 'Afro', 'Buzzcut', 'Other'];
const bodyTypeOptions = ['Slim', 'Athletic', 'Average', 'Muscular', 'Plus Size', 'Petite', 'Tall'];
const vibeOptions = ['Friendly', 'Serious', 'Mysterious', 'Energetic', 'Calm', 'Intense', 'Whimsical', 'Professional'];

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
      dialogue: '',
    },
  });

  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);

  const toggleVibe = (vibe: string) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter(v => v !== vibe));
    } else if (selectedVibes.length < 3) {
      setSelectedVibes([...selectedVibes, vibe]);
    }
    form.setValue('vibe', selectedVibes);
  };

  const handleSubmit = (data: any) => {
    data.vibe = selectedVibes;
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
            </div>

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
              name="dialogue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Optional Dialogue/Scene Context</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a line of dialogue or scene context to influence the character's expression"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This helps generate a more specific emotional state for your character.
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
