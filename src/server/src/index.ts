import express, { Express, Request, Response } from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createTRPCRouter, createExpressRouter } from "./routes";
import { env } from "./util/env";
import { AppContext } from "./types";
import { createContext } from "./context";

export type TRPCRouter = ReturnType<typeof createTRPCRouter>;

const run = async () => {
  const app: Express = express();
  const ctx: AppContext = await createContext();

  app.use(cors<Request>());
  app.use(express.json());

  app.use(createExpressRouter(ctx));

  const trpcRouter = createTRPCRouter(ctx);

  app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
      router: trpcRouter,
    })
  );

  app.listen(env.PORT, () => {
    console.log(`Server is running at http://localhost:${env.PORT}`);
  });
};

run();
