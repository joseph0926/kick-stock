import React from "react";

const App = ({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: string;
}) => {
  return (
    <html lang="ko" className={theme} style={{ colorScheme: theme }}>
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/dist/logo.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>KickStock</title>
        <link rel="stylesheet" href="/dist/assets/index.css" />
        <script type="module" src="/dist/index.js" crossOrigin="" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
};

export default App;
