import express, { Express, Request, Response } from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createTRPCRouter, createExpressRouter } from "./routes";
import { env } from "./util/env";
import { AppContext } from "./types";
import { createAppContext, createTRPCContext } from "./context";
import { errorHandlerExpress } from "./util/error";
import { createJetStream } from "./firehose/jetstream";

export type TRPCRouter = ReturnType<typeof createTRPCRouter>;

const run = async () => {
  const app: Express = express();
  const ctx: AppContext = await createAppContext();

  const jetstream = createJetStream(ctx);

  app.use(
    cors<Request>({
      origin: [
        env.isProduction ? env.PUBLIC_URL : `${env.PUBLIC_URL}:${env.PORT}`,
      ],
      credentials: true,
    })
  );
  app.use(express.json());

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

  app.listen(env.API_PORT, () => {
    console.log("Server is running");
    jetstream.start();
  });
};

run();
