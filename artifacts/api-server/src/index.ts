// ── Error handlers FIRST — before any module initialisation can crash silently ──
process.on("uncaughtException", (err) => {
  console.error("[fatal] Uncaught exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  console.error("[fatal] Unhandled promise rejection:", reason);
  process.exit(1);
});

console.log("[startup] Error handlers registered");

async function main() {
  console.log("[startup] Loading application modules...");

  // Dynamic imports run inside the try-catch, so any module-level error
  // (bad env var, failed constructor, etc.) is caught and logged clearly.
  try {
    const { default: app } = await import("./app");
    const { seedAcademies } = await import("./lib/seedAcademies.js");
    const { seedAdminAccounts } = await import("./lib/seedAdminAccounts.js");
    const { seedDemoData } = await import("./lib/seedDemoData.js");

    const port = Number(process.env["PORT"] ?? 8080);
    if (Number.isNaN(port) || port <= 0) {
      console.error(`[fatal] Invalid PORT value: "${process.env["PORT"]}"`);
      process.exit(1);
    }

    console.log(`[startup] Binding to port ${port}...`);

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server listening on port ${port}`);
      seedAcademies()
        .then(() => seedAdminAccounts())
        .then(() => seedDemoData())
        .catch((err) => console.error("[seed] Seeding failed:", err));
    });
  } catch (err) {
    console.error("[fatal] Module initialisation failed:", err);
    process.exit(1);
  }
}

main();
