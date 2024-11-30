import { IronSession } from "iron-session";
import { Session } from "../types";
import { DidService } from "./did";

export class UserService {
  constructor(private didService: DidService) {}

  async getCurrentUser(session?: IronSession<Session>) {
    if (session) {
      const { did } = session;
      const handle = await this.didService.resolveDidToHandle(did);
      return {
        isLoggedIn: true,
        handle: handle,
      };
    } else {
      return { isLoggedIn: false };
    }
  }
}
