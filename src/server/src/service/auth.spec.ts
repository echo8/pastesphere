import { afterEach, describe, it, expect } from "vitest";
import { mock, mockReset } from "vitest-mock-extended";
import { NodeOAuthClient } from "@atproto/oauth-client-node";
import { IronSession } from "iron-session";
import { Session } from "../types";
import { AuthService, InvalidHandleError, AuthorizeFailure } from "./auth";

describe("auth service", async () => {
  const mockOAuthClient = mock<NodeOAuthClient>();
  const authService = new AuthService(mockOAuthClient);

  afterEach(() => {
    mockReset(mockOAuthClient);
  });

  describe("login", () => {
    it("should return a redirect url", async () => {
      mockOAuthClient.authorize.mockResolvedValue(
        new URL("http://example.com/")
      );

      const resp = await authService.login("alice.test");
      expect(resp.redirectUrl).toBe("http://example.com/");
    });

    it("should throw error on oauth client error", async () => {
      mockOAuthClient.authorize.mockRejectedValue(new Error("oauth error"));

      await expect(authService.login("alice.test")).rejects.toThrow(
        AuthorizeFailure
      );
    });

    it("should throw error on invalid handle", async () => {
      await expect(authService.login("invalid")).rejects.toThrow(
        InvalidHandleError
      );
    });
  });

  describe("logout", () => {
    it("should destroy session", () => {
      const sessionMock = mock<IronSession<Session>>();
      authService.logout(sessionMock);
      expect(sessionMock.destroy).toHaveBeenCalledOnce();
    });
  });
});
