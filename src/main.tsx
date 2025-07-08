import "normalize.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Game from "@/components/Game";
import "@/styles/variables.scss";
import "../reset.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Game />
  </StrictMode>
);
