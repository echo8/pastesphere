import { IronSession } from "iron-session";
import { Session } from "../types";
import { DidService } from "./did";
import { AuthService } from "./auth";

export class UserService {
  constructor(
    private didService: DidService,
    private authService: AuthService
  ) {}

  async getCurrentUser(session?: IronSession<Session>) {
    if (session) {
      const oauthSession = await this.authService.getSession(session);
      if (oauthSession) {
        const handle = await this.didService.resolveDidToHandle(oauthSession.did);
        return {
          isLoggedIn: true,
          handle: handle,
        };
      }
    }
    return { isLoggedIn: false };
  }
}
