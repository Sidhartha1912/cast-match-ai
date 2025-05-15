
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const PrivacyBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Alert className="max-w-5xl mx-auto bg-background border shadow-lg">
        <AlertTitle className="text-castmatch-purple">Privacy First</AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            CastMatch.AI processes all data in-session. No images or character data are stored after you leave.
          </div>
          <Button size="sm" onClick={() => setIsVisible(false)}>
            Got it
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PrivacyBanner;
