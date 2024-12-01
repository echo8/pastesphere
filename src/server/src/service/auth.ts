import { Request, Response } from "express";
import type { OAuthClient } from "@atproto/oauth-client-node";
import { isValidHandle } from "@atproto/syntax";
import { getIronSession, IronSession } from "iron-session";
import { ClientError, ServerError } from "../util/error";
import { Session } from "../types";
import { env } from "../util/env";

export class AuthService {
  constructor(private oauthClient: OAuthClient) {}

  async login(handle: string) {
    if (!isValidHandle(handle)) {
      throw new InvalidHandleError();
    }
    try {
      const url = await this.oauthClient.authorize(handle, {
        scope: "atproto transition:generic",
      });
      return { redirectUrl: url.toString() };
    } catch (err) {
      throw new AuthorizeFailure(err);
    }
  }

  logout(session?: IronSession<Session>) {
    session?.destroy();
  }

  async callback(req: Request, res: Response) {
    const params = new URLSearchParams(req.originalUrl.split("?")[1]);
    const { session } = await this.oauthClient.callback(params);
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
    return `http://pastesphere.localhost:${env.PORT}/`;
  }

  getClientMetadata() {
    return this.oauthClient.clientMetadata;
  }

  async getSession(session?: IronSession<Session>) {
    if (session) {
      try {
        return await this.oauthClient.restore(session.did);
      } catch (err) {
        this.logout(session);
      }
    }
    return null;
  }
}

export class InvalidHandleError extends ClientError {
  constructor() {
    super("Invalid handle.");
  }
}

export class AuthorizeFailure extends ServerError {
  constructor(cause: unknown) {
    super("Failed to initiate login.", cause);
  }
}
