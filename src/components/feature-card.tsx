'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { improveDescriptionAction } from '@/app/actions';
import type { Feature } from '@/lib/data';
import { Wand2 } from 'lucide-react';

interface FeatureCardProps {
  feature: Feature & { summary: string, originalDescription: string };
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  const [description, setDescription] = useState(feature.summary);
  const [isImproving, setIsImproving] = useState(false);
  const { toast } = useToast();

  const handleImprove = async () => {
    setIsImproving(true);
    try {
      const result = await improveDescriptionAction({ description });
      setDescription(result.improvedDescription);
      toast({
        title: "Description Improved!",
        description: "The feature description has been updated with an AI-enhanced version.",
      });
    } catch (error) {
      console.error('Failed to improve description:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not improve the description. Please try again later.",
      });
    } finally {
      setIsImproving(false);
    }
  };

  const Icon = feature.icon;

  return (
    <Card className="flex flex-col h-full bg-card rounded-xl shadow-sm transition-transform duration-300 hover:-translate-y-2 group">
      <CardHeader>
        <div className="mb-4">
          <Icon className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleImprove} disabled={isImproving}>
          <Wand2 className="mr-2 h-4 w-4" />
          {isImproving ? 'Improving...' : 'Improve with AI'}
        </Button>
      </CardFooter>
    </Card>
  );
}
