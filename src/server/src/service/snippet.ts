import { Agent } from "@atproto/api";
import { TID } from "@atproto/common";
import { ValidationError } from "@atproto/lexicon";
import * as Snippet from "../lexicon/types/link/pastesphere/snippet";
import { Database } from "../db";
import { ClientError } from "../util/error";

const LEXICON_ID = "link.pastesphere.snippet";

export class SnippetService {
  constructor(private db: Database) {}

  async create(
    snippet: {
      title: string;
      description: string;
      type: string;
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
    return dbRecord;
  }

  async get(did: string, rkey: string) {
    const snippet = await this.db
      .selectFrom("snippet")
      .selectAll()
      .where("authorDid", "=", did)
      .where("rkey", "=", rkey)
      .executeTakeFirst();
    return snippet;
  }

  async getForUser(did: string) {
    return await this.db
      .selectFrom("snippet")
      .selectAll()
      .where("authorDid", "=", did)
      .orderBy("id", "desc")
      .limit(5)
      .execute();
  }
}

export class SnippetValidationError extends ClientError {
  constructor(err: ValidationError) {
    super("Invalid snippet: " + err.message, err);
  }
}
