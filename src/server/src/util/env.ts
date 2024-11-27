import dotenv from "dotenv";
import { cleanEnv, port, str } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  COOKIE_SECRET: str({ devDefault: "00000000000000000000000000000000" }),
  PORT: port({ default: 2022 }),
});
