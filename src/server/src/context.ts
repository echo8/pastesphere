import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { getIronSession } from "iron-session";
import { createClient } from "./auth/client";
import { AppContext, TRPCContext, Session } from "./types";
import { env } from "./util/env";
import { createDb, migrateToLatest } from "./db";
import { AuthService } from "./service/auth";
import { DidService, createIdResolver } from "./service/did";
import { UserService } from "./service/user";
import { SnippetService } from "./service/snippet";

export const createAppContext = async (): Promise<AppContext> => {
  const db = createDb(env.DB_PATH);
  await migrateToLatest(db);

  const oauthClient = await createClient(db);
  const authService = new AuthService(oauthClient);
  const didService = new DidService(createIdResolver());
  const userService = new UserService(didService, authService);
  const snippetService = new SnippetService(db, didService);
  return {
    oauthClient: oauthClient,
    authService: authService,
    didService: didService,
    userService: userService,
    snippetService: snippetService,
  };
};

export const createTRPCContext = async (
  opts: CreateExpressContextOptions
): Promise<TRPCContext> => {
  const session = await getIronSession<Session>(opts.req, opts.res, {
    cookieName: "sid",
    password: env.COOKIE_SECRET,
    cookieOptions: {
      domain: env.COOKIE_DOMAIN,
    },
  });

  if (!session.did) {
    return {};
  }

  return {
    session,
  };
};
