import { afterEach, describe, it, expect } from "vitest";
import { mockDeep, mockReset, mock } from "vitest-mock-extended";
import { Agent } from "@atproto/api";
import type { CommitCreateEvent, CommitCreate } from "@skyware/jetstream";
import { sql } from "kysely";
import { createDb, migrateToLatest } from "../db";
import { env } from "../util/env";
import {
  SnippetService,
  LEXICON_ID,
  SnippetValidationError,
  CreateEventValidationError,
} from "./snippet";
import { DidService } from "./did";
import { SnippetType } from "../types";

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
          type: SnippetType.PlainText,
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
        type: SnippetType.PlainText,
        body: "testBody",
      };
      await expect(
        snippetService.create(invalidSnippet, mockAgent)
      ).rejects.toThrow(SnippetValidationError);
    });
  });

  describe("sync", () => {
    it("should sync snippet from create event to the db", async () => {
      const snippet = {
        title: "testTitle",
        description: "testDescription",
        type: SnippetType.PlainText,
        body: "testBody",
      };
      const eventMock = mock<CommitCreateEvent<typeof LEXICON_ID>>({
        did: "did:test",
        commit: mock<CommitCreate<typeof LEXICON_ID>>({
          record: {
            $type: LEXICON_ID,
            ...snippet,
          },
          rkey: "testKey",
        }),
      });
      await snippetService.sync(eventMock);
      const dbSnippet = await snippetService.get("did:test", "testKey");
      expect(dbSnippet).toBeDefined();
      if (dbSnippet) {
        expect({
          ...snippet,
          authorDid: "did:test",
          authorHandle: "alice.test",
          rkey: "testKey",
          createdAt: dbSnippet.createdAt,
        }).toStrictEqual(withoutId(dbSnippet));
      }
    });

    it("should throw error on invalid create event", async () => {
      const snippet = {
        description: "testDescription",
        type: SnippetType.PlainText,
        body: "testBody",
      };
      const eventMock = mock<CommitCreateEvent<typeof LEXICON_ID>>({
        did: "did:test",
        commit: mock<CommitCreate<typeof LEXICON_ID>>({
          record: {
            $type: LEXICON_ID,
            ...snippet,
          },
          rkey: "testKey",
        }),
      });
      await expect(snippetService.sync(eventMock)).rejects.toThrowError(
        CreateEventValidationError
      );
    });

    it("should throw error on invalid snippet", async () => {
      const snippet = {
        title: "",
        description: "testDescription",
        type: SnippetType.PlainText,
        body: "testBody",
      };
      const eventMock = mock<CommitCreateEvent<typeof LEXICON_ID>>({
        did: "did:test",
        commit: mock<CommitCreate<typeof LEXICON_ID>>({
          record: {
            $type: LEXICON_ID,
            ...snippet,
          },
          rkey: "testKey",
        }),
      });
      await expect(snippetService.sync(eventMock)).rejects.toThrowError(
        SnippetValidationError
      );
    });

    it("should do nothing when snippet already exists in db", async () => {
      const snippet = {
        title: "testTitle",
        description: "testDescription",
        type: SnippetType.PlainText,
        body: "testBody",
      };
      const existingSnippet = {
        authorDid: "did:test",
        rkey: "testKey",
        ...snippet,
        createdAt: new Date().toISOString(),
      };
      await db.insertInto("snippet").values(existingSnippet).execute();
      const eventMock = mock<CommitCreateEvent<typeof LEXICON_ID>>({
        did: "did:test",
        commit: mock<CommitCreate<typeof LEXICON_ID>>({
          record: {
            $type: LEXICON_ID,
            ...snippet,
          },
          rkey: "testKey",
        }),
      });
      await snippetService.sync(eventMock);
      const dbSnippet = await snippetService.get("did:test", "testKey");
      expect(dbSnippet).toBeDefined();
      if (dbSnippet) {
        expect(withHandle(existingSnippet)).toStrictEqual(withoutId(dbSnippet));
      }
    });
  });

  describe("get", () => {
    it("should return correct snippet", async () => {
      const newSnippet = {
        authorDid: "did:test",
        rkey: "testKey",
        title: "testTitle",
        description: "testDescription",
        type: SnippetType.PlainText,
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
          type: SnippetType.PlainText,
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
          type: SnippetType.PlainText,
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
