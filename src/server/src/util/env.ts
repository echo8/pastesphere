import dotenv from "dotenv";
import { cleanEnv, port } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  PORT: port({ default: 2022 }),
});
