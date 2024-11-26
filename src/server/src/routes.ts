import express, { Request, Response } from "express";
import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { z } from "zod";
import { AppContext } from "./types";

const expressHandler =
  (fn: express.Handler) =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };

const createExpressRouter = (ctx: AppContext) => {
  const router = express.Router();

  router.get(
    "/hello1",
    expressHandler(async (_, res) => {
      res.send("Hello1");
    })
  );

  return router;
};

const t = initTRPC.create();

export const appRouter = t.router({
  login: t.procedure
    .input(
      z.object({
        handle: z.string(),
      })
    )
    .mutation((opts) => {
      // const { handle } = opts.input;
      return { redirectUrl: "https://www.google.com" };
    }),
});

export type AppRouter = typeof appRouter;

export const createRouter = (ctx: AppContext) => {
  const router = express.Router();

  router.use(createExpressRouter(ctx));

  router.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
    })
  );

  return router;
};
