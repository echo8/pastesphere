import { afterEach, describe, it, expect } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { IdResolver } from "@atproto/identity";
import { DidService } from "./did";

describe("did service", () => {
  const mockIdResolver = mockDeep<IdResolver>();
  const didService = new DidService(mockIdResolver);

  afterEach(() => {
    mockReset(mockIdResolver);
  });

  describe("did to handle", () => {
    it("should return resolved handle", async () => {
      mockIdResolver.did.resolveAtprotoData.mockResolvedValue({
        handle: "alice.test",
        did: "",
        signingKey: "",
        pds: "",
      });
      mockIdResolver.handle.resolve.mockResolvedValue("did:test");
      const handle = await didService.resolveDidToHandle("did:test");
      expect(handle).toBe("alice.test");
    });
  });

  describe("handle to did", () => {
    it("should return resolved did", async () => {
      mockIdResolver.handle.resolve.mockResolvedValue("did:test");
      const did = await didService.resolveHandleToDid("alice.test");
      expect(did).toBe("did:test");
    });
  });
});
