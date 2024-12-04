import type { OAuthClient } from "@atproto/oauth-client-node";
import { IronSession } from "iron-session";
import { z } from "zod";
import { AuthService } from "./service/auth";
import { DidService } from "./service/did";
import { UserService } from "./service/user";
import { SnippetService } from "./service/snippet";

export type AppContext = {
  oauthClient: OAuthClient;
  authService: AuthService;
  didService: DidService;
  userService: UserService;
  snippetService: SnippetService;
};

export type TRPCContext = {
  session?: IronSession<Session>;
};

export type Session = { did: string };

export enum SnippetType {
  PlainText = "Plain Text",
  Markdown = "Markdown",
  Bash = "Bash",
  C = "C",
  CSharp = "C#",
  CPlusPlus = "C++",
  Clojure = "Clojure",
  CSS = "CSS",
  D = "D",
  Dart = "Dart",
  Docker = "Docker",
  Elixir = "Elixir",
  Erlang = "Erlang",
  Go = "Go",
  Gradle = "Gradle",
  Groovy = "Groovy",
  Haskell = "Haskell",
  HTML = "HTML",
  Java = "Java",
  JavaScript = "JavaScript",
  JSON = "JSON",
  Julia = "Julia",
  Kotlin = "Kotlin",
  LaTeX = "LaTeX",
  Lisp = "Lisp",
  Lua = "Lua",
  Makefile = "Makefile",
  Nim = "Nim",
  ObjectiveC = "Objective-C",
  OCaml = "OCaml",
  Perl = "Perl",
  PHP = "PHP",
  PowerShell = "PowerShell",
  ProtocolBuffers = "Protocol Buffers",
  Python = "Python",
  // Racket = "Racket",
  Ruby = "Ruby",
  Rust = "Rust",
  Scala = "Scala",
  Scheme = "Scheme",
  SQL = "SQL",
  Swift = "Swift",
  TOML = "TOML",
  TypeScript = "TypeScript",
  Vim = "Vim",
  XML = "XML",
  YAML = "YAML",
  Zig = "Zig",
}

export const SnippetSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.nativeEnum(SnippetType),
  body: z.string(),
});
