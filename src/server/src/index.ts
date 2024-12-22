import express, { Express, Request, Response } from "express";
import compression from "compression";
import cors from "cors";
import pino from "pino";
import https from "https";
import fs from "fs";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createTRPCRouter, createExpressRouter } from "./routes";
import { env } from "./util/env";
import { AppContext } from "./types";
import { createAppContext, createTRPCContext } from "./context";
import { errorHandlerExpress } from "./util/error";
import { createJetStream } from "./firehose/jetstream";

export type TRPCRouter = ReturnType<typeof createTRPCRouter>;

const logger = pino({ name: "server" });

const run = async () => {
  const app: Express = express();
  const ctx: AppContext = await createAppContext();

  const jetstream = createJetStream(ctx);

  app.set("view engine", "ejs");

  app.use(
    cors<Request>({
      origin: env.isProduction
        ? [env.PUBLIC_URL, env.PUBLIC_WWW_URL]
        : [`${env.PUBLIC_URL}:${env.PORT}`],
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(compression());

  // the atproto oauth flow in dev needs to redirect to a callback on host 127.0.0.1,
  // so redirect that request to our regular host before creating the session
  app.use((req, res, next) => {
    if (req.hostname === "127.0.0.1") {
      res.redirect(
        new URL(
          req.originalUrl,
          env.isProduction
            ? env.PUBLIC_URL
            : `${env.PUBLIC_URL}:${env.API_PORT}`
        ).toString()
      );
    } else {
      next();
    }
  });

  app.use(createExpressRouter(ctx));

  const trpcRouter = createTRPCRouter(ctx);

  app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
      router: trpcRouter,
      createContext: createTRPCContext,
    })
  );

  app.use(errorHandlerExpress());

  if (env.isProduction) {
    https
      .createServer(
        {
          cert: fs.readFileSync("/certs/fullchain.pem"),
          key: fs.readFileSync("/certs/privkey.pem"),
        },
        app
      )
      .listen(env.PORT, () => {
        logger.info("Server is running");
        jetstream.start();
      });
  } else {
    app.listen(env.API_PORT, () => {
      logger.info("Server is running");
      jetstream.start();
    });
  }
};

run();
