import { NodeOAuthClient } from "@atproto/oauth-client-node";
import { env } from "../util/env";
import { StateStore, SessionStore } from "./store";
import { Database } from "../db";

export const createClient = async (db: Database) => {
  const url = env.isProduction
    ? env.PUBLIC_API_URL
    : `http://127.0.0.1:${env.API_PORT}`;
  const enc = encodeURIComponent;
  return new NodeOAuthClient({
    clientMetadata: {
      client_name: "pastesphere",
      client_id: env.isProduction
        ? `${url}/oauth/clientMetadata`
        : `http://localhost?redirect_uri=${enc(`${url}/oauth/callback`)}`,
      client_uri: url,
      redirect_uris: [`${url}/oauth/callback`],
      scope: "atproto transition:generic",
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      application_type: "web",
      token_endpoint_auth_method: "none",
      dpop_bound_access_tokens: true,
    },
    plcDirectoryUrl: env.PLC_URL,
    // @ts-expect-error:
    handleResolver: env.BSKY_API_URL,
    stateStore: new StateStore(db),
    sessionStore: new SessionStore(db),
  });
};
