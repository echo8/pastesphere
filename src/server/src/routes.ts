import express, { Request, Response } from "express";
import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { getIronSession } from "iron-session";
import { isValidHandle } from "@atproto/syntax";
import { AppContext, Session } from "./types";
import { env } from "./util/env";

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
      const params = new URLSearchParams(req.originalUrl.split("?")[1]);
      try {
        const { session } = await ctx.oauthClient.callback(params);
        const clientSession = await getIronSession<Session>(req, res, {
          cookieName: "sid",
          password: env.COOKIE_SECRET,
        });
        if (!clientSession.did) {
          clientSession.did = session.did;
          await clientSession.save();
        } else {
          console.log("session already exists");
        }
      } catch (err) {
        console.log(err);
      }
      return res.redirect("/");
    })
  );

  router.get(
    "/api/oauth/clientMetadata",
    expressHandler(async (req, res) => {
      return res.json(ctx.oauthClient.clientMetadata);
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
        if (!isValidHandle(handle)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid handle.",
          });
        }
        try {
          const url = await ctx.oauthClient.authorize(handle, {
            scope: "atproto transition:generic",
          });
          return { redirectUrl: url.toString() };
        } catch (err) {
          console.log(err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to initiate login.",
          });
        }
      }),
  });

  return appRouter;
};
