import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import "@kickstock/ui/src/index.css";
import App from "./App.tsx";

hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <App />
  </StrictMode>,
);
