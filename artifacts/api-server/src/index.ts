import app from "./app";
import { seedAcademies } from "./lib/seedAcademies.js";
import { seedAdminAccounts } from "./lib/seedAdminAccounts.js";
import { seedDemoData } from "./lib/seedDemoData.js";

// ── Catch unhandled errors before they silently kill the process ──────────
process.on("uncaughtException", (err) => {
  console.error("[fatal] Uncaught exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  console.error("[fatal] Unhandled promise rejection:", reason);
  process.exit(1);
});

// ── Port — default to 8080 (Replit deployment) if PORT not injected ───────
const port = Number(process.env["PORT"] ?? 8080);
if (Number.isNaN(port) || port <= 0) {
  console.error(`[fatal] Invalid PORT value: "${process.env["PORT"]}"`);
  process.exit(1);
}

app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
  seedAcademies()
    .then(() => seedAdminAccounts())
    .then(() => seedDemoData())
    .catch((err) => console.error("[seed] Seeding failed:", err));
});
