import type {
  NodeSavedSession,
  NodeSavedSessionStore,
  NodeSavedState,
  NodeSavedStateStore,
} from "@atproto/oauth-client-node";

export class StateStore implements NodeSavedStateStore {
  constructor() {}
  async get(key: string): Promise<NodeSavedState | undefined> {
    return undefined;
  }
  async set(key: string, val: NodeSavedState) {}
  async del(key: string) {}
}

export class SessionStore implements NodeSavedSessionStore {
  constructor() {}
  async get(key: string): Promise<NodeSavedSession | undefined> {
    return undefined;
  }
  async set(key: string, val: NodeSavedSession) {}
  async del(key: string) {}
}
