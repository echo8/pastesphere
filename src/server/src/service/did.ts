import { IdResolver, MemoryCache } from "@atproto/identity";
import { env } from "../util/env";

const HOUR = 60e3 * 60;
const DAY = HOUR * 24;

export function createIdResolver() {
  return new IdResolver({
    didCache: new MemoryCache(HOUR, DAY),
    plcUrl: "http://localhost:2582",
  });
}

export class DidService {
  constructor(private idResolver: IdResolver) {}

  async resolveDidToHandle(did: string) {
    const didDoc = await this.idResolver.did.resolveAtprotoData(did);
    // resolving handles doesn't work in the local dev env
    if (env.NODE_ENV === "production") {
      const resolvedDid = await this.resolveHandleToDid(didDoc.handle);
      if (resolvedDid === did) {
        return didDoc.handle;
      }
      return did;
    } else {
      return didDoc.handle;
    }
  }

  async resolveHandleToDid(handle: string) {
    return await this.idResolver.handle.resolve(handle);
  }
}
