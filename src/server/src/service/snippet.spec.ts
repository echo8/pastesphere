import { afterEach, describe, it, expect } from "vitest";
import { mockDeep, mockReset, mock } from "vitest-mock-extended";
import { Agent } from "@atproto/api";
import { sql } from "kysely";
import { createDb, migrateToLatest } from "../db";
import { env } from "../util/env";
import { SnippetService, SnippetValidationError } from "./snippet";
import { DidService } from "./did";

describe("snippet service", async () => {
  const mockAgent = mockDeep<Agent>({ assertDid: "did:test" });
  const mockDidService = mock<DidService>();

  mockDidService.resolveDidToHandle.mockResolvedValue("alice.test");

  const db = createDb(env.DB_PATH);
  await migrateToLatest(db);

  const snippetService = new SnippetService(db, mockDidService);

  afterEach(async () => {
    mockReset(mockAgent);
    await db.deleteFrom("snippet").execute();
    await sql<string>`delete from sqlite_sequence where name='snippet';`.execute(
      db
    );
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
        expect(newSnippet).toStrictEqual(withoutId(dbSnippet));
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
        expect(withHandle(newSnippet)).toStrictEqual(withoutId(dbSnippet));
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
      const { snippets: dbSnippets, nextCursor } =
        await snippetService.getForUser("did:test", 5);
      expect(dbSnippets.length).toBe(2);
      expect(nextCursor).toBeUndefined();
      for (let i = 0; i < 2; i++) {
        expect(withHandle(newSnippets[i])).toStrictEqual(
          withoutId(dbSnippets[i])
        );
      }
    });

    it("should return paginated results when specifying a cursor", async () => {
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
      const { snippets: dbSnippets, nextCursor } =
        await snippetService.getForUser("did:test", 1);
      expect(dbSnippets.length).toBe(1);
      expect(nextCursor).toBe(1);
      expect(withHandle(newSnippets[0])).toStrictEqual(
        withoutId(dbSnippets[0])
      );
      const { snippets: dbSnippets2, nextCursor: nextCursor2 } =
        await snippetService.getForUser("did:test", 1, nextCursor);
      expect(dbSnippets2.length).toBe(1);
      expect(nextCursor2).toBeUndefined();
      expect(withHandle(newSnippets[1])).toStrictEqual(
        withoutId(dbSnippets2[0])
      );
    });
  });
});

const withHandle = (snippet: any) => {
  return { ...snippet, authorHandle: "alice.test" };
};

const withoutId = (snippet: any) => {
  const { id, ...noId } = snippet;
  return noId;
};
