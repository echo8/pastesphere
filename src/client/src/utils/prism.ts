import { SnippetType } from "../../../server/src/types";

export const prismLangMap = new Map<SnippetType, string>([
  [SnippetType.Bash, "bash"],
  [SnippetType.C, "c"],
  [SnippetType.CSharp, "csharp"],
  [SnippetType.CPlusPlus, "cpp"],
  [SnippetType.Clojure, "clojure"],
  [SnippetType.CSS, "css"],
  [SnippetType.D, "d"],
  [SnippetType.Dart, "dart"],
  [SnippetType.Docker, "docker"],
  [SnippetType.Elixir, "elixir"],
  [SnippetType.Erlang, "erlang"],
  [SnippetType.Go, "go"],
  [SnippetType.Gradle, "gradle"],
  [SnippetType.Groovy, "groovy"],
  [SnippetType.Haskell, "haskell"],
  [SnippetType.HTML, "markup"],
  [SnippetType.Java, "java"],
  [SnippetType.JavaScript, "javascript"],
  [SnippetType.JSON, "json"],
  [SnippetType.Julia, "julia"],
  [SnippetType.Kotlin, "kotlin"],
  [SnippetType.LaTeX, "latex"],
  [SnippetType.Lisp, "lisp"],
  [SnippetType.Lua, "lua"],
  [SnippetType.Makefile, "makefile"],
  [SnippetType.Nim, "nim"],
  [SnippetType.ObjectiveC, "objectivec"],
  [SnippetType.OCaml, "ocaml"],
  [SnippetType.Perl, "perl"],
  [SnippetType.PHP, "php"],
  [SnippetType.PowerShell, "powershell"],
  [SnippetType.ProtocolBuffers, "protobuf"],
  [SnippetType.Python, "python"],
  // [SnippetType.Racket, "racket"],
  [SnippetType.Ruby, "ruby"],
  [SnippetType.Rust, "rust"],
  [SnippetType.Scala, "scala"],
  [SnippetType.Scheme, "scheme"],
  [SnippetType.SQL, "sql"],
  [SnippetType.Swift, "swift"],
  [SnippetType.TOML, "toml"],
  [SnippetType.TypeScript, "typescript"],
  [SnippetType.Vim, "vim"],
  [SnippetType.XML, "markup"],
  [SnippetType.YAML, "yaml"],
  [SnippetType.Zig, "zig"],
]);

export const loadStyles = async (snippetType: SnippetType) => {
  switch (snippetType) {
    case SnippetType.PlainText:
    case SnippetType.Markdown:
      break;
    case SnippetType.Bash:
      // @ts-ignore
      await import("prismjs/components/prism-bash");
      break;
    case SnippetType.C:
      // @ts-ignore
      await import("prismjs/components/prism-c");
      break;
    case SnippetType.CSharp:
      // @ts-ignore
      await import("prismjs/components/prism-csharp");
      break;
    case SnippetType.CPlusPlus:
      // @ts-ignore
      await import("prismjs/components/prism-cpp");
      break;
    case SnippetType.Clojure:
      // @ts-ignore
      await import("prismjs/components/prism-clojure");
      break;
    case SnippetType.CSS:
      // @ts-ignore
      await import("prismjs/components/prism-css");
      break;
    case SnippetType.D:
      // @ts-ignore
      await import("prismjs/components/prism-d");
      break;
    case SnippetType.Dart:
      // @ts-ignore
      await import("prismjs/components/prism-dart");
      break;
    case SnippetType.Docker:
      // @ts-ignore
      await import("prismjs/components/prism-docker");
      break;
    case SnippetType.Elixir:
      // @ts-ignore
      await import("prismjs/components/prism-elixir");
      break;
    case SnippetType.Erlang:
      // @ts-ignore
      await import("prismjs/components/prism-erlang");
      break;
    case SnippetType.Go:
      // @ts-ignore
      await import("prismjs/components/prism-go");
      break;
    case SnippetType.Gradle:
      // @ts-ignore
      await import("prismjs/components/prism-gradle");
      break;
    case SnippetType.Groovy:
      // @ts-ignore
      await import("prismjs/components/prism-groovy");
      break;
    case SnippetType.Haskell:
      // @ts-ignore
      await import("prismjs/components/prism-haskell");
      break;
    case SnippetType.HTML:
      // @ts-ignore
      await import("prismjs/components/prism-markup");
      break;
    case SnippetType.Java:
      // @ts-ignore
      await import("prismjs/components/prism-java");
      break;
    case SnippetType.JavaScript:
      // @ts-ignore
      await import("prismjs/components/prism-javascript");
      break;
    case SnippetType.JSON:
      // @ts-ignore
      await import("prismjs/components/prism-json");
      break;
    case SnippetType.Julia:
      // @ts-ignore
      await import("prismjs/components/prism-julia");
      break;
    case SnippetType.Kotlin:
      // @ts-ignore
      await import("prismjs/components/prism-kotlin");
      break;
    case SnippetType.LaTeX:
      // @ts-ignore
      await import("prismjs/components/prism-latex");
      break;
    case SnippetType.Lisp:
      // @ts-ignore
      await import("prismjs/components/prism-lisp");
      break;
    case SnippetType.Lua:
      // @ts-ignore
      await import("prismjs/components/prism-lua");
      break;
    case SnippetType.Makefile:
      // @ts-ignore
      await import("prismjs/components/prism-makefile");
      break;
    case SnippetType.Nim:
      // @ts-ignore
      await import("prismjs/components/prism-nim");
      break;
    case SnippetType.ObjectiveC:
      // @ts-ignore
      await import("prismjs/components/prism-objectivec");
      break;
    case SnippetType.OCaml:
      // @ts-ignore
      await import("prismjs/components/prism-ocaml");
      break;
    case SnippetType.Perl:
      // @ts-ignore
      await import("prismjs/components/prism-perl");
      break;
    case SnippetType.PHP:
      // @ts-ignore
      await import("prismjs/components/prism-php");
      break;
    case SnippetType.PowerShell:
      // @ts-ignore
      await import("prismjs/components/prism-powershell");
      break;
    case SnippetType.ProtocolBuffers:
      // @ts-ignore
      await import("prismjs/components/prism-protobuf");
      break;
    case SnippetType.Python:
      // @ts-ignore
      await import("prismjs/components/prism-python");
      break;
    case SnippetType.Ruby:
      // @ts-ignore
      await import("prismjs/components/prism-ruby");
      break;
    case SnippetType.Rust:
      // @ts-ignore
      await import("prismjs/components/prism-rust");
      break;
    case SnippetType.Scala:
      // @ts-ignore
      await import("prismjs/components/prism-scala");
      break;
    case SnippetType.Scheme:
      // @ts-ignore
      await import("prismjs/components/prism-scheme");
      break;
    case SnippetType.SQL:
      // @ts-ignore
      await import("prismjs/components/prism-sql");
      break;
    case SnippetType.Swift:
      // @ts-ignore
      await import("prismjs/components/prism-swift");
      break;
    case SnippetType.TOML:
      // @ts-ignore
      await import("prismjs/components/prism-toml");
      break;
    case SnippetType.TypeScript:
      // @ts-ignore
      await import("prismjs/components/prism-typescript");
      break;
    case SnippetType.Vim:
      // @ts-ignore
      await import("prismjs/components/prism-vim");
      break;
    case SnippetType.XML:
      // @ts-ignore
      await import("prismjs/components/prism-markup");
      break;
    case SnippetType.YAML:
      // @ts-ignore
      await import("prismjs/components/prism-yaml");
      break;
    case SnippetType.Zig:
      // @ts-ignore
      await import("prismjs/components/prism-zig");
      break;
  }
};
