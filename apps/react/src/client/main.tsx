import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import "../styles/index.css";
import { ClientRoot } from "./components/client-root";

const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes("width(0) and height(0) of chart")) {
    return;
  }
  originalWarn.apply(console, args);
};

hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <ClientRoot />
  </StrictMode>,
);
