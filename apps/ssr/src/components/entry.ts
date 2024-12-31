import { StaticHandlerContext } from "react-router";

export function getEntryHeader() {
  return `
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/dist/logo.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>KickStock</title>
    <link rel="stylesheet" href="/dist/assets/index.css" />
    <link rel="modulepreload" href="/dist/js/vendor-react.js" crossorigin />
    <link rel="modulepreload" href="/dist/js/vendor-motion.js" crossorigin />
    <script type="module" src="/dist/index.js" crossorigin></script>
  </head>
  <body>
    <div id="root">
`;
}

export function getEntryBottom(context: StaticHandlerContext) {
  return `
    </div>
    <script>
      window.__staticRouterHydrationData = ${JSON.stringify(context)};
    </script>
  </body>
</html>
`;
}
