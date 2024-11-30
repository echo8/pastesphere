import express from "express";
import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { AppContext } from "./types";
import { createTRPCContext } from "./context";

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
    "/api/oauth/callback",
    expressHandler(async (req, res) => {
      const url = await ctx.authService.callback(req, res);
      return res.redirect(url);
    })
  );

  router.get(
    "/api/oauth/clientMetadata",
    expressHandler(async (req, res) => {
      return ctx.authService.clientMetadata();
    })
  );

  return router;
};

export const createTRPCRouter = (ctx: AppContext) => {
  const t = initTRPC.context<typeof createTRPCContext>().create();

  const appRouter = t.router({
    login: t.procedure
      .input(
        z.object({
          handle: z.string(),
        })
      )
      .mutation(async (opts) => {
        const { handle } = opts.input;
        return await ctx.authService.login(handle);
      }),
    logout: t.procedure.mutation((opts) => {
      ctx.authService.logout(opts.ctx.session);
    }),
    getCurrentUser: t.procedure.query(async (opts) => {
      return await ctx.userService.getCurrentUser(opts.ctx.session);
    }),
  });

  return appRouter;
};
