import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { bufferMusic } from "./lib/globalAudio";

// Only buffer (download) the audio file — do NOT play yet.
// Music starts explicitly when the player reaches their Welcome page.
bufferMusic();

createRoot(document.getElementById("root")!).render(<App />);
