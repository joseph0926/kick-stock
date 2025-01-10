import { CacheInvalidation } from "@/components/cache";
import { headers } from "next/headers";

async function getEnvironmentConfig() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const isProduction =
    !host.includes("localhost") && !host.includes("127.0.0.1");

  const baseUrl = isProduction
    ? "https://kick-stock.onrender.com"
    : "http://localhost:4001";

  return {
    baseUrl,
    environment: (isProduction ? "prod" : "dev") as "prod" | "dev",
    cacheSecret: process.env.CACHE_SECRET || "",
  };
}

export default async function CachePage() {
  const config = await getEnvironmentConfig();

  return (
    <main className="max-w-3xl mx-auto w-full p-4">
      <CacheInvalidation
        baseUrl={config.baseUrl}
        cacheSecret={config.cacheSecret}
        environment={config.environment}
      />
    </main>
  );
}
