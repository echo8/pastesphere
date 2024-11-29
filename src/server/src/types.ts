import type { OAuthClient } from "@atproto/oauth-client-node";
import { IronSession } from "iron-session";
import { BidirectionalResolver } from "./util/idresolver";

export type AppContext = {
  oauthClient: OAuthClient;
  idResolver: BidirectionalResolver;
};

export type TRPCContext = {
  session?: IronSession<Session>;
};

export type Session = { did: string };
