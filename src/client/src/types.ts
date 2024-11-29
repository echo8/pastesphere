export type User = {
  isLoggedIn: boolean;
  name: string;
};

export enum SnippetType {
  PlainText,
  Markdown,
  Java,
}

export type Snippet = {
  author: string;
  title: string;
  description: string;
  type: SnippetType;
  body: string;
};
