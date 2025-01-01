import React from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@kickstock/ui/src/components/ui/card";

export const MainLoading = ({
  message = "페이지를 불러오는 중입니다...",
}: {
  message?: string;
}) => {
  return (
    <div className="background flex min-h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-primary/20" />
          </div>

          <div className="space-y-2 text-center">
            <p className="text-lg font-medium text-foreground">{message}</p>
            <p className="text-sm text-muted-foreground">잠시만 기다려주세요</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
