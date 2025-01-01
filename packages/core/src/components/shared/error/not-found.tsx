import React from "react";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";
import { Card } from "@kickstock/ui/src/components/ui/card";
import { Button } from "@kickstock/ui/src/components/ui/button";
import { useNavigate } from "react-router";

export const NotFoundPage = ({
  message = "요청하신 페이지를 찾을 수 없습니다",
}: {
  message?: string;
}) => {
  const navigate = useNavigate();

  return (
    <div className="background flex min-h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center space-y-2">
            <FileQuestion className="h-20 w-20 animate-pulse text-muted-foreground" />
            <h1 className="text-4xl font-bold text-primary">404</h1>
          </div>

          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold text-foreground">
              페이지를 찾을 수 없습니다
            </h2>
            <p className="text-muted-foreground">{message}</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              variant="outline"
              className="space-x-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>이전 페이지</span>
            </Button>
            <Button className="space-x-2" onClick={() => navigate("/")}>
              <Home className="h-4 w-4" />
              <span>홈으로 가기</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
