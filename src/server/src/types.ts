import type { OAuthClient } from "@atproto/oauth-client-node";
import { IronSession } from "iron-session";

export type AppContext = {
  oauthClient: OAuthClient;
};

export type TRPCContext = {
  session?: IronSession<Session>;
};

export type Session = { did: string };
