import React from "react";

const App = ({ children }: { children: React.ReactNode }) => {
  return (
    <body>
      <div id="root">{children}</div>
    </body>
  );
};

export default App;
