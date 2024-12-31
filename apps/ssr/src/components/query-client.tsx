import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClientRef = React.useRef<QueryClient>(null);

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnMount: false,
          refetchOnWindowFocus: false,
        },
      },
    });
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
    </QueryClientProvider>
  );
}
