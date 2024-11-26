import type { OAuthClient } from "@atproto/oauth-client-node";

export type AppContext = {
  oauthClient: OAuthClient;
};
