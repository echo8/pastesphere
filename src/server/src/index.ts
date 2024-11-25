import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { z } from "zod";
import { createRouter } from "./routes";

const t = initTRPC.create();

export const appRouter = t.router({
  getUser: t.procedure.input(z.string()).query((opts) => {
    opts.input; // string
    return { id: opts.input, name: "Bilbo" };
  }),
});

export type AppRouter = typeof appRouter;

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 2022;

app.use(cors<Request>());

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

app.use(createRouter({}));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
