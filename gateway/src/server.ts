import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.GATEWAY_PORT, () => {
  console.log(`SkillGraph gateway listening on ${env.GATEWAY_PORT}`);
});
