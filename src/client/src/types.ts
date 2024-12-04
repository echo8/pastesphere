import { SnippetType } from "../../server/src/types";

export type User = {
  isLoggedIn: boolean;
  handle: string;
};

export type Snippet = {
  authorDid: string;
  authorHandle: string;
  rkey: string;
  title: string;
  description: string;
  type: SnippetType;
  body: string;
  createdAt: string;
};
