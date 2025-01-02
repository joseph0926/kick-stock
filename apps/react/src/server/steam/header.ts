import { isProd } from "../lib/env-utils";

export function getHtmlHeader(theme: string) {
  return `
    <html lang="ko" class="${theme}" style="color-scheme: ${theme}">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>KickStock</title>
        ${
          isProd
            ? `<link rel="icon" type="image/svg+xml" href="/dist/logo.svg" />
            <link rel="stylesheet" href="/dist/assets/index.css" />
            <script type="module" src="/dist/index.js" crossOrigin=""></script>`
            : `<script type="module">
              import RefreshRuntime from "http://localhost:4001/@react-refresh"
              RefreshRuntime.injectIntoGlobalHook(window) 
              window.$RefreshReg$ = () => {}
              window.$RefreshSig$ = () => (type) => type
              window.__vite_plugin_react_preamble_installed__ = true
            </script>
            <script type="module" src="http://localhost:4001/@vite/client"></script>
            <script type="module" src="http://localhost:4001/main.js"></script>`
        }
      </head>
  `;
}

export function getHtmlFooter() {
  return `</html>`;
}
