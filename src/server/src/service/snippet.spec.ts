import { afterEach, describe, it, expect } from "vitest";
import { mockDeep, mockReset, mock } from "vitest-mock-extended";
import { Agent } from "@atproto/api";
import { createDb, migrateToLatest } from "../db";
import { env } from "../util/env";
import { SnippetService, SnippetValidationError } from "./snippet";

describe("snippet service", async () => {
  const mockAgent = mockDeep<Agent>({ assertDid: "did:test" });

  const db = createDb(env.DB_PATH);
  await migrateToLatest(db);

  const snippetService = new SnippetService(db);

  afterEach(async () => {
    mockReset(mockAgent);
    await db.deleteFrom("snippet").execute();
  });

  describe("create", () => {
    it("should create new snippet", async () => {
      const newSnippet = await snippetService.create(
        {
          title: "testTitle",
          description: "testDescription",
          type: "testType",
          body: "testBody",
        },
        mockAgent
      );
      const dbSnippet = await snippetService.get("did:test", newSnippet.rkey);
      expect(dbSnippet).toBeDefined();
      if (dbSnippet) {
        const { id, ...dbSnippetWithoutId } = dbSnippet;
        expect(newSnippet).toStrictEqual(dbSnippetWithoutId);
      }
    });

    it("should throw error on invalid snippet", async () => {
      const invalidSnippet = {
        title: "",
        description: "testDescription",
        type: "testType",
        body: "testBody",
      };
      await expect(
        snippetService.create(invalidSnippet, mockAgent)
      ).rejects.toThrow(SnippetValidationError);
    });
  });

  describe("get", () => {
    it("should return correct snippet", async () => {
      const newSnippet = {
        authorDid: "did:test",
        rkey: "testKey",
        title: "testTitle",
        description: "testDescription",
        type: "testType",
        body: "testBody",
        createdAt: new Date().toISOString(),
      };
      await db.insertInto("snippet").values(newSnippet).execute();
      const dbSnippet = await snippetService.get(
        newSnippet.authorDid,
        newSnippet.rkey
      );
      expect(dbSnippet).toBeDefined();
      if (dbSnippet) {
        const { id, ...dbSnippetWithoutId } = dbSnippet;
        expect(newSnippet).toStrictEqual(dbSnippetWithoutId);
      }
    });

    it("should return undefined when no snippet exists", async () => {
      const dbSnippet = await snippetService.get("did:test", "testKey");
      expect(dbSnippet).toBeUndefined();
    });
  });

  describe("get for user", () => {
    it("should return latest snippets for a specific user", async () => {
      let newSnippets = [];
      for (let i = 0; i < 2; i++) {
        const newSnippet = {
          authorDid: "did:test",
          rkey: "testKey" + i,
          title: "testTitle",
          description: "testDescription",
          type: "testType",
          body: "testBody",
          createdAt: new Date().toISOString(),
        };
        await db.insertInto("snippet").values(newSnippet).execute();
        newSnippets.push(newSnippet);
      }
      newSnippets = newSnippets.toReversed();
      const dbSnippets = await snippetService.getForUser("did:test");
      for (let i = 0; i < 2; i++) {
        const { id, ...dbSnippetWithoutId } = dbSnippets[i];
        expect(newSnippets[i]).toStrictEqual(dbSnippetWithoutId);
      }
    });
  });
});
