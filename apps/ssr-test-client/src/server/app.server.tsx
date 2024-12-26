"use server";

import React from "react";

const App = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Test!!!</title>
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
};

export default App;
