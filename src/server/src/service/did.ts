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
  private devCache = new Map<string, string>();

  constructor(private idResolver: IdResolver) {}

  async resolveDidToHandle(did: string) {
    const didDoc = await this.idResolver.did.resolveAtprotoData(did);
    if (env.NODE_ENV === "development") {
      this.devCache.set(didDoc.handle, did);
    }
    const resolvedDid = await this.resolveHandleToDid(didDoc.handle);
    if (resolvedDid === did) {
      return didDoc.handle;
    }
    return did;
  }

  async resolveHandleToDid(handle: string) {
    if (env.NODE_ENV === "development") {
      return this.devCache.get(handle);
    } else {
      return await this.idResolver.handle.resolve(handle);
    }
  }
}
