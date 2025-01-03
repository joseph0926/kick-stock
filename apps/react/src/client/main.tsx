import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import "../styles/index.css";
import { ClientRoot } from "./components/client-root";

hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <ClientRoot />
  </StrictMode>,
);
