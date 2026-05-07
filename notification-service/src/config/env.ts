import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

export const env = z
  .object({
    NOTIFICATION_SERVICE_PORT: z.coerce.number().default(3002)
  })
  .parse(process.env);
