import { Suspense } from 'react';
import { features as initialFeatures, type Feature } from '@/lib/data';
import { summarizeFeatureDescriptions } from '@/ai/flows/summarize-feature-descriptions';
import FeatureCard from '@/components/feature-card';
import { Skeleton } from '@/components/ui/skeleton';

async function FeaturesGrid() {
  let features: (Feature & { summary: string; originalDescription: string; })[] = [];
  try {
    const descriptionsToSummarize = initialFeatures.map(f => ({ description: f.description }));
    const summaries = await summarizeFeatureDescriptions(descriptionsToSummarize);
    features = initialFeatures.map((feature, index) => ({
      ...feature,
      summary: summaries[index]?.summary || feature.description,
      originalDescription: feature.description,
    }));
  } catch (error) {
    console.error("Failed to summarize features:", error);
    features = initialFeatures.map(feature => ({
      ...feature,
      summary: feature.description,
      originalDescription: feature.description,
    }));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <FeatureCard key={index} feature={feature} />
      ))}
    </div>
  );
}

function FeaturesSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="p-6 bg-card rounded-xl shadow-sm space-y-4">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-10 w-32 rounded-md mt-4" />
                </div>
            ))}
        </div>
    );
}

export default function Features() {
  return (
    <section id="features" className="bg-secondary/50">
      <div className="container mx-auto py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="font-bold text-primary uppercase tracking-[2px]">
            FEATURES
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mt-2">What I Do</h2>
        </div>
        <Suspense fallback={<FeaturesSkeleton />}>
          <FeaturesGrid />
        </Suspense>
      </div>
    </section>
  );
}
