import { cleanEnv, port, str } from "envalid";

const isProduction = process.env.NODE_ENV === "production";

const match = <Prod, Dev>({ prod, dev }: { prod: Prod; dev: Dev }) => {
  return isProduction ? prod : dev;
};

export const env = cleanEnv(process.env, {
  COOKIE_SECRET: str({ devDefault: "00000000000000000000000000000000" }),
  COOKIE_DOMAIN: str({
    default: match({
      prod: "pastesphere.link",
      dev: "pastesphere.localhost",
    }),
  }),
  PORT: port({ default: 3000 }),
  API_PORT: port({ default: 2022 }),
  DB_PATH: str({ default: ":memory:" }),
  NODE_ENV: str({
    choices: ["development", "production", "test"],
  }),
  PUBLIC_URL: str({
    default: match({
      prod: "https://pastesphere.link",
      dev: "http://pastesphere.localhost",
    }),
  }),
  PUBLIC_WWW_URL: str({
    default: "https://www.pastesphere.link",
  }),
  PUBLIC_API_URL: str({
    default: match({
      prod: "https://api.pastesphere.link",
      dev: "http://pastesphere.localhost",
    }),
  }),
  PLC_URL: str({
    default: match({
      prod: "https://plc.directory",
      dev: "http://localhost:2582",
    }),
  }),
  BSKY_API_URL: str({
    default: match({
      prod: "https://public.api.bsky.app",
      dev: "http://localhost:2584",
    }),
  }),
  JETSTREAM_ENDPOINT: str({
    default: match({
      prod: "wss://jetstream1.us-west.bsky.network/subscribe",
      dev: "ws://localhost:6008/subscribe",
    }),
  }),
});
