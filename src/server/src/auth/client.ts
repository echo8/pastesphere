import { NodeOAuthClient } from "@atproto/oauth-client-node";
import { env } from "../util/env";
import { StateStore, SessionStore } from "./store";

export const createClient = async () => {
  const url = `http://127.0.0.1:${env.PORT}`;
  const enc = encodeURIComponent;
  return new NodeOAuthClient({
    clientMetadata: {
      client_name: "pastesphere",
      client_id: `http://localhost?redirect_uri=${enc(`${url}/oauth/callback`)}`,
      client_uri: url,
      redirect_uris: [`${url}/oauth/callback`],
      scope: "atproto transition:generic",
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      application_type: "web",
      token_endpoint_auth_method: "none",
      dpop_bound_access_tokens: true,
    },
    plcDirectoryUrl: "http://localhost:2582",
    // @ts-expect-error:
    handleResolver: "http://localhost:2584",
    stateStore: new StateStore(),
    sessionStore: new SessionStore(),
  });
};
