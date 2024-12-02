export type User = {
  isLoggedIn: boolean;
  handle: string;
};

export enum SnippetType {
  PlainText,
  Markdown,
  Java,
}

export type Snippet = {
  authorDid: string;
  authorHandle: string;
  rkey: string;
  title: string;
  description: string;
  type: string;
  body: string;
  createdAt: string;
};
