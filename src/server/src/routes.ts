import express, { Request, Response } from "express";
import { initTRPC } from "@trpc/server";
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

export const createExpressRouter = (ctx: AppContext) => {
  const router = express.Router();

  router.get(
    "/hello1",
    expressHandler(async (_, res) => {
      res.send("Hello1");
    })
  );

  return router;
};

export const createTRPCRouter = (ctx: AppContext) => {
  const t = initTRPC.create();

  const appRouter = t.router({
    login: t.procedure
      .input(
        z.object({
          handle: z.string(),
        })
      )
      .mutation(async (opts) => {
        const { handle } = opts.input;
        try {
          const url = await ctx.oauthClient.authorize(handle, {
            scope: "atproto transition:generic",
          });
          return { redirectUrl: url.toString() };
        } catch (err) {
          console.log(err);
        }
      }),
  });

  return appRouter;
};
