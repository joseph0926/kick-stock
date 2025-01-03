import { isProd } from "../lib/env-utils";
import fs from "fs";
import path from "path";

type ChunkType = {
  file: string;
  name: string;
  src?: string;
  isEntry?: boolean;
  imports?: string[];
  css?: string[];
};

type Manifest = Record<string, ChunkType>;

function loadManifest(): Manifest | null {
  if (!isProd) return null;

  try {
    const manifestPath = path.resolve(
      process.cwd(),
      "dist/client/.vite/manifest.json",
    );
    const manifestContent = fs.readFileSync(manifestPath, "utf-8");
    return JSON.parse(manifestContent);
  } catch (error) {
    console.error("Failed to load manifest.json:", error);
    return null;
  }
}

function getAllImportedChunks(
  manifest: Manifest,
  chunkKey: string,
  visited = new Set<string>(),
): ChunkType[] {
  if (visited.has(chunkKey)) return [];
  visited.add(chunkKey);

  const chunk = manifest[chunkKey];
  if (!chunk) return [];

  const chunks: ChunkType[] = [chunk];

  if (chunk.imports) {
    for (const importKey of chunk.imports) {
      const importedChunks = getAllImportedChunks(manifest, importKey, visited);
      chunks.push(...importedChunks);
    }
  }

  return chunks;
}

function getStyleChunk(manifest: Manifest): ChunkType | null {
  return manifest["style.css"] || null;
}

function getEntryChunkKey(): string | null {
  return "src/client/main.tsx";
}

function generateProdTags(): string {
  const manifest = loadManifest();
  if (!manifest) return "";

  const entryKey = getEntryChunkKey();
  if (!entryKey) return "";

  const entryChunk = manifest[entryKey];
  const styleChunk = getStyleChunk(manifest);
  const importedChunks = getAllImportedChunks(manifest, entryKey);

  const processedFiles = new Set<string>();
  const tags: string[] = [];

  function addAssetTag(chunk: ChunkType, type: "style" | "preload" | "script") {
    if (processedFiles.has(chunk.file)) return;
    processedFiles.add(chunk.file);

    const assetPath = `/client/${chunk.file}`;

    switch (type) {
      case "style":
        tags.push(`<link rel="stylesheet" href="${assetPath}" />`);
        break;
      case "preload":
        tags.push(`<link rel="modulepreload" href="${assetPath}" />`);
        break;
      case "script":
        tags.push(
          `<script type="module" src="${assetPath}" crossorigin></script>`,
        );
        break;
    }
  }

  if (styleChunk) {
    addAssetTag(styleChunk, "style");
  }

  const reactChunk = importedChunks.find(
    (chunk) => chunk.name === "vendor-react",
  );
  if (reactChunk) {
    addAssetTag(reactChunk, "preload");
  }

  const vendorOrder = ["floating", "radix", "carousel"] as const;
  vendorOrder.forEach((vendorName) => {
    const vendorChunk = importedChunks.find(
      (chunk) => chunk.name === `vendor-${vendorName}`,
    );
    if (vendorChunk) {
      addAssetTag(vendorChunk, "preload");
    }
  });

  addAssetTag(entryChunk, "script");

  return tags.join("\n    ");
}

function generateDevTags(): string {
  const devServer = "http://localhost:5173";

  return `<script type="module">
      import RefreshRuntime from "${devServer}/@react-refresh"
      RefreshRuntime.injectIntoGlobalHook(window) 
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
    </script>
    <script type="module" src="${devServer}/@vite/client"></script>
    <script type="module" src="${devServer}/src/client/main.tsx"></script>`;
}

export function getHtmlHeader(): string {
  return `<!doctype html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>KickStock</title>
        <link rel="icon" type="image/svg+xml" href="/client/logo.svg" /> <!-- 로고 경로 수정 -->
        ${isProd ? generateProdTags() : generateDevTags()}
      </head>
      <body>
        <div id="root">`;
}

export function getHtmlFooter(): string {
  return `</div></body></html>`;
}
