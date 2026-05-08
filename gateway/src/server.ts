import { app } from "./app.js";
import { env } from "./config/env.js";
import { startIngestionWorker } from "./workers/ingestion.worker.js";

app.listen(env.GATEWAY_PORT, () => {
  console.log(`SkillGraph gateway listening on ${env.GATEWAY_PORT}`);
});

// Start the ingestion worker in the background
startIngestionWorker().catch((error) => {
  console.error("Failed to start ingestion worker:", error);
  process.exit(1);
});
