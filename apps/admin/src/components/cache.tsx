"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CodeBlock } from "@/components/ui/code-block";
import { Loader2 } from "lucide-react";

interface RedisCacheResponse {
  success: boolean;
  message: string;
  data: {
    environment: string;
    timestamp: string;
    invalidationResult: boolean;
    pattern: string;
    details?: {
      patternUsed: string;
      cacheInstance: string;
      operationType: string;
    };
  };
}

interface CDNCacheResponse {
  success: boolean;
  message: string;
  data: {
    timestamp: string;
    totalPaths: number;
    successCount: number;
    failureCount: number;
    results: Array<{
      path: string;
      status: "success" | "failed";
      statusCode?: number;
    }>;
  };
}

interface ErrorResponse {
  success: boolean;
  error: string;
  timestamp: string;
  details?: {
    reason: string;
    errorType?: string;
    environment?: string;
    failedPaths?: string[];
    errorMessages?: string[];
    stack?: string;
  };
}

interface CacheResult {
  type: "redis" | "cdn";
  data: RedisCacheResponse | CDNCacheResponse | ErrorResponse;
  error?: string;
}

interface CacheInvalidationProps {
  baseUrl: string;
  cacheSecret: string;
  environment: "dev" | "prod";
}

export function CacheInvalidation({
  baseUrl,
  cacheSecret,
  environment,
}: CacheInvalidationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CacheResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const invalidateCache = async () => {
    setIsLoading(true);
    setError(null);
    const newResults: CacheResult[] = [];

    try {
      try {
        const redisResponse = await axios.post<RedisCacheResponse>(
          `${baseUrl}/api/redis/invalidate`,
          {},
          {
            headers: {
              "x-cache-secret": cacheSecret,
              "x-cache-env": environment,
            },
          }
        );
        newResults.push({
          type: "redis",
          data: redisResponse.data,
        });
      } catch (redisError: unknown) {
        if (axios.isAxiosError(redisError) && redisError.response) {
          newResults.push({
            type: "redis",
            data: redisError.response.data as ErrorResponse,
            error: redisError.message,
          });
        } else {
          const error = redisError as Error;
          newResults.push({
            type: "redis",
            data: {
              success: false,
              error: error.message,
              timestamp: new Date().toISOString(),
            },
            error: error.message,
          });
        }
      }

      try {
        const cdnResponse = await axios.post<CDNCacheResponse>(
          `${baseUrl}/api/cdn-cache/invalidate`,
          {},
          {
            headers: {
              "x-cache-secret": cacheSecret,
            },
          }
        );
        newResults.push({
          type: "cdn",
          data: cdnResponse.data,
        });
      } catch (cdnError: unknown) {
        if (axios.isAxiosError(cdnError) && cdnError.response) {
          newResults.push({
            type: "cdn",
            data: cdnError.response.data as ErrorResponse,
            error: cdnError.message,
          });
        } else {
          const error = cdnError as Error;
          newResults.push({
            type: "cdn",
            data: {
              success: false,
              error: error.message,
              timestamp: new Date().toISOString(),
            },
            error: error.message,
          });
        }
      }

      setResults(newResults);
    } catch (error) {
      const err = error as Error;
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatResult = (result: CacheResult) => {
    return JSON.stringify(result.data, null, 2);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            캐시 무효화 대시보드
            <span className="text-sm font-normal text-muted-foreground">
              환경: {environment === "prod" ? "운영" : "개발"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={invalidateCache}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                캐시 무효화 진행 중...
              </>
            ) : (
              "전체 캐시 무효화"
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>오류 발생: {error}</AlertDescription>
        </Alert>
      )}

      {results.map((result, index) => (
        <Card key={`${result.type}-${index}`}>
          <CardHeader>
            <CardTitle>
              {result.type === "redis" ? "Redis 캐시" : "CDN 캐시"} 결과
              {result.error && (
                <span className="text-red-500 text-sm ml-2">
                  (오류: {result.error})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock
              language="json"
              filename={`${result.type}-result.json`}
              code={formatResult(result)}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
