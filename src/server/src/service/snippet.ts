import { Agent } from "@atproto/api";
import { TID } from "@atproto/common";
import { ValidationError } from "@atproto/lexicon";
import * as Snippet from "../lexicon/types/link/pastesphere/snippet";
import { Database } from "../db";
import { ClientError } from "../util/error";
import { DidService } from "./did";
import { SnippetType } from "../types";

const LEXICON_ID = "link.pastesphere.snippet";

export class SnippetService {
  constructor(
    private db: Database,
    private didService: DidService
  ) {}

  async create(
    snippet: {
      title: string;
      description: string;
      type: SnippetType;
      body: string;
    },
    agent: Agent
  ) {
    const rkey = TID.nextStr();
    const atRecord = {
      $type: LEXICON_ID,
      ...snippet,
      createdAt: new Date().toISOString(),
    };
    const validationRes = Snippet.validateRecord(atRecord);
    if (!validationRes.success) {
      throw new SnippetValidationError(validationRes.error);
    }
    await agent.com.atproto.repo.putRecord({
      repo: agent.assertDid,
      collection: LEXICON_ID,
      rkey: rkey,
      record: atRecord,
      validate: false,
    });
    const dbRecord = {
      ...snippet,
      authorDid: agent.assertDid,
      rkey: rkey,
      createdAt: atRecord.createdAt,
    };
    await this.db.insertInto("snippet").values(dbRecord).execute();
    const authorHandle = await this.didService.resolveDidToHandle(
      dbRecord.authorDid
    );
    return { ...dbRecord, authorHandle };
  }

  async get(did: string, rkey: string) {
    const snippet = await this.db
      .selectFrom("snippet")
      .selectAll()
      .where("authorDid", "=", did)
      .where("rkey", "=", rkey)
      .executeTakeFirst();
    if (snippet) {
      const authorHandle = await this.didService.resolveDidToHandle(
        snippet.authorDid
      );
      return { ...snippet, authorHandle };
    }
  }

  async getForUser(did: string, limit: number, cursor?: number | null) {
    let query = this.db
      .selectFrom("snippet")
      .selectAll()
      .where("authorDid", "=", did)
      .orderBy("id", "desc")
      .limit(limit + 1);
    if (cursor) {
      query = query.where("id", "<=", cursor);
    }
    const snippets = await query.execute();
    const authorHandle = await this.didService.resolveDidToHandle(did);
    const res = [];
    for (const snippet of snippets) {
      res.push({ ...snippet, authorHandle });
    }
    let nextCursor: number | undefined = undefined;
    if (res.length > limit) {
      const nextItem = res.pop();
      nextCursor = nextItem!.id;
    }
    return { snippets: res, nextCursor };
  }
}

export class SnippetValidationError extends ClientError {
  constructor(err: ValidationError) {
    super("Invalid snippet: " + err.message, err);
  }
}
