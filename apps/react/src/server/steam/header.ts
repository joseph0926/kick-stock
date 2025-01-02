import { isProd } from "../lib/env-utils";

export function getHtmlHeader(theme: string) {
  return `
    <!doctype html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>KickStock</title>
        ${
          isProd
            ? `<link rel="icon" type="image/svg+xml" href="/dist/logo.svg" />
            <link rel="stylesheet" href="/dist/assets/index.css" />
            <script type="module" src="/dist/index.js" crossorigin></script>`
            : `<script type="module">
              import RefreshRuntime from "http://localhost:5173/@react-refresh"
              RefreshRuntime.injectIntoGlobalHook(window) 
              window.$RefreshReg$ = () => {}
              window.$RefreshSig$ = () => (type) => type
              window.__vite_plugin_react_preamble_installed__ = true
            </script>
            <script type="module" src="http://localhost:5173/@vite/client"></script>
            <script type="module" src="http://localhost:5173/src/client/main.tsx"></script><script type="module" src="http://localhost:5173/index.css"></script>`
        }
      </head>
      <body>
        <div id="root">`;
}

export function getHtmlFooter() {
  return `</div></body></html>`;
}
