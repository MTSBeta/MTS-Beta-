import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { preloadMusic } from "./lib/globalAudio";

preloadMusic();

createRoot(document.getElementById("root")!).render(<App />);
