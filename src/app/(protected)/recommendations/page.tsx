'use client';

import BookRecommendation from '@/components/recommendations/BookRecommendation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import useHandleError from '@/hooks/useHandleError';
import { postRecommendations } from '@/lib/api';
import HydratedBookRecommendation from '@/types/HydratedBookRecommendation';
import { BookCopyIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<
    HydratedBookRecommendation[]
  >([]);
  const { handleError } = useHandleError();

  const generateRecommendations = useCallback(async () => {
    try {
      const generatedRecommendations = await postRecommendations();
      setRecommendations(generatedRecommendations);
    } catch (error) {
      return handleError(error);
    }
  }, [handleError]);

  return (
    <div>
      <h1 className="flex gap-2 items-center">
        <BookCopyIcon size={18} />
        Recommendations
      </h1>
      {recommendations.length === 0 ? (
        <div className="flex flex-col w-full items-center mt-[80px] gap-3">
          <p>Generate personalized book recommendations</p>
          <Button variant="default" onClick={() => generateRecommendations()}>
            Generate
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-8">
          <Separator />
          {recommendations.map((recommendation) => (
            <div key={recommendation.id} className="grid gap-8">
              <BookRecommendation recommendation={recommendation} />
              <Separator />
            </div>
          ))}
          <div className="flex mt-4 w-full justify-center">
            <Button variant="default" onClick={() => generateRecommendations()}>
              Regenerate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
