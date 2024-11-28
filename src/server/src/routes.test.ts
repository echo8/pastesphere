import { afterEach, describe, it, expect, vi } from "vitest";
import { NodeOAuthClient } from "@atproto/oauth-client-node";
import { initTRPC, inferProcedureInput, TRPCError } from "@trpc/server";
import { createTRPCRouter } from "./routes";
import { createTRPCContext } from "./context";
import type { TRPCRouter } from ".";

vi.mock("@atproto/oauth-client-node");

describe("login procedure", async () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const { NodeOAuthClient } = await vi.importMock<
    typeof import("@atproto/oauth-client-node")
  >("@atproto/oauth-client-node");

  // @ts-ignore
  const mockOAuthClient = new NodeOAuthClient();
  const router = createTRPCRouter({ oauthClient: mockOAuthClient });
  const caller = initTRPC
    .context<typeof createTRPCContext>()
    .create()
    .createCallerFactory(router)({});

  it("should return a redirect url", async () => {
    vi.mocked(mockOAuthClient.authorize).mockResolvedValue(
      new URL("http://example.com/")
    );

    const input: inferProcedureInput<TRPCRouter["login"]> = {
      handle: "alice.test",
    };

    const resp = await caller.login(input);
    expect(resp?.redirectUrl).toBe("http://example.com/");
  });

  it("should return internal server error on oauth client error", async () => {
    vi.mocked(mockOAuthClient.authorize).mockRejectedValue(
      new Error("oauth error")
    );

    const input: inferProcedureInput<TRPCRouter["login"]> = {
      handle: "alice.test",
    };

    await expect(caller.login(input)).rejects.toThrow(
      "Failed to initiate login."
    );
  });

  it("should return bad request error on invalid handle", async () => {
    const input: inferProcedureInput<TRPCRouter["login"]> = {
      handle: "invalid",
    };

    await expect(caller.login(input)).rejects.toThrow("Invalid handle.");
  });
});
