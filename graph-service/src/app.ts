import express from "express";
import { env } from "./config/env.js";
import { graphRouter } from "./routes/graph.routes.js";

const app = express();

app.use(express.json());
app.get("/health", (_req, res) => res.json({ success: true, data: { service: "graph-service", status: "ok" } }));
app.use("/graph", graphRouter);

app.listen(env.GRAPH_SERVICE_PORT, () => {
  console.log(`SkillGraph graph service listening on ${env.GRAPH_SERVICE_PORT}`);
});
