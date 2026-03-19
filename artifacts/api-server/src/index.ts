import app from "./app";
import { seedAcademies } from "./lib/seedAcademies.js";
import { seedAdminAccounts } from "./lib/seedAdminAccounts.js";
import { seedDemoData } from "./lib/seedDemoData.js";
const rawPort = process.env["PORT"];
if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}
app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
  seedAcademies()
    .then(() => seedAdminAccounts())
    .then(() => seedDemoData())
    .catch((err) => console.error("[seed] Seeding failed:", err));
});
