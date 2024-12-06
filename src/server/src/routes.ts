import express from "express";
import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { IronSession } from "iron-session";
import { Agent } from "@atproto/api";
import { AppContext, Session, SnippetType, SnippetSchema } from "./types";
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
    "/oauth/callback",
    expressHandler(async (req, res) => {
      const url = await ctx.authService.callback(req, res);
      return res.redirect(url);
    })
  );

  router.get(
    "/oauth/clientMetadata",
    expressHandler(async (req, res) => {
      return res.json(ctx.authService.getClientMetadata());
    })
  );

  return router;
};

export const createTRPCRouter = (ctx: AppContext) => {
  const t = initTRPC.context<typeof createTRPCContext>().create();

  const getAgent = async (session?: IronSession<Session>) => {
    const oauthSession = await ctx.authService.getSession(session);
    if (oauthSession) {
      return new Agent(oauthSession);
    }
    throw new TRPCError({
      message: "You need to login to perform this operation.",
      code: "UNAUTHORIZED",
    });
  };

  const snippetRouter = t.router({
    create: t.procedure.input(SnippetSchema).mutation(async (opts) => {
      const agent = await getAgent(opts.ctx.session);
      return await ctx.snippetService.create(opts.input, agent);
    }),
    get: t.procedure
      .input(
        z.object({
          handle: z.string(),
          rkey: z.string(),
        })
      )
      .query(async (opts) => {
        const { handle, rkey } = opts.input;
        const did = await ctx.didService.resolveHandleToDid(handle);
        if (did) {
          const snippet = await ctx.snippetService.get(did, rkey);
          if (snippet) {
            return snippet;
          }
        }
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }),
    getForUser: t.procedure
      .input(
        z.object({
          handle: z.string(),
          limit: z.number().min(1).max(50).nullish(),
          cursor: z.number().nullish(),
        })
      )
      .query(async (opts) => {
        const { handle, cursor } = opts.input;
        const limit = opts.input.limit ?? 5;
        const did = await ctx.didService.resolveHandleToDid(handle);
        if (did) {
          return await ctx.snippetService.getForUser(did, limit, cursor);
        }
        return { snippets: [], nextCursor: undefined };
      }),
  });

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
    snippet: snippetRouter,
  });

  return appRouter;
};
