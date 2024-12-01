import type { OAuthClient } from "@atproto/oauth-client-node";
import { IronSession } from "iron-session";
import { AuthService } from "./service/auth";
import { DidService } from "./service/did";
import { UserService } from "./service/user";
import { SnippetService } from "./service/snippet";

export type AppContext = {
  oauthClient: OAuthClient;
  authService: AuthService;
  didService: DidService;
  userService: UserService;
  snippetService: SnippetService;
};

export type TRPCContext = {
  session?: IronSession<Session>;
};

export type Session = { did: string };
