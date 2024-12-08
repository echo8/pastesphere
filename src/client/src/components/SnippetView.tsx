import {
  Box,
  HStack,
  VStack,
  Text,
  Container,
  Icon,
  Link as ChakraLink,
  Code,
  IconButton,
} from "@chakra-ui/react";
import { useColorMode } from "./ui/color-mode";
import { HiOutlineDocumentText, HiLink } from "react-icons/hi2";
import { Link } from "react-router";
import { Highlight, themes, Prism } from "prism-react-renderer";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Snippet } from "../types";
import { SnippetType } from "../../../server/src/types";

const prismLangMap = new Map<SnippetType, string>([
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

(typeof global !== "undefined" ? global : window).Prism = Prism;
// @ts-ignore
await import("prismjs/components/prism-bash");
// @ts-ignore
await import("prismjs/components/prism-c");
// @ts-ignore
await import("prismjs/components/prism-csharp");
// @ts-ignore
await import("prismjs/components/prism-cpp");
// @ts-ignore
await import("prismjs/components/prism-clojure");
// @ts-ignore
await import("prismjs/components/prism-css");
// @ts-ignore
await import("prismjs/components/prism-d");
// @ts-ignore
await import("prismjs/components/prism-dart");
// @ts-ignore
await import("prismjs/components/prism-docker");
// @ts-ignore
await import("prismjs/components/prism-elixir");
// @ts-ignore
await import("prismjs/components/prism-erlang");
// @ts-ignore
await import("prismjs/components/prism-go");
// @ts-ignore
await import("prismjs/components/prism-gradle");
// @ts-ignore
await import("prismjs/components/prism-groovy");
// @ts-ignore
await import("prismjs/components/prism-haskell");
// @ts-ignore
await import("prismjs/components/prism-markup");
// @ts-ignore
await import("prismjs/components/prism-java");
// @ts-ignore
await import("prismjs/components/prism-javascript");
// @ts-ignore
await import("prismjs/components/prism-json");
// @ts-ignore
await import("prismjs/components/prism-julia");
// @ts-ignore
await import("prismjs/components/prism-kotlin");
// @ts-ignore
await import("prismjs/components/prism-latex");
// @ts-ignore
await import("prismjs/components/prism-lisp");
// @ts-ignore
await import("prismjs/components/prism-lua");
// @ts-ignore
await import("prismjs/components/prism-makefile");
// @ts-ignore
await import("prismjs/components/prism-nim");
// @ts-ignore
await import("prismjs/components/prism-objectivec");
// @ts-ignore
await import("prismjs/components/prism-ocaml");
// @ts-ignore
await import("prismjs/components/prism-perl");
// @ts-ignore
await import("prismjs/components/prism-php");
// @ts-ignore
await import("prismjs/components/prism-markup-templating");
// @ts-ignore
await import("prismjs/components/prism-clike");
// @ts-ignore
await import("prismjs/components/prism-powershell");
// @ts-ignore
await import("prismjs/components/prism-protobuf");
// @ts-ignore
await import("prismjs/components/prism-python");
// // @ts-ignore
// await import("prismjs/components/prism-racket");
// @ts-ignore
await import("prismjs/components/prism-ruby");
// @ts-ignore
await import("prismjs/components/prism-rust");
// @ts-ignore
await import("prismjs/components/prism-scala");
// @ts-ignore
await import("prismjs/components/prism-scheme");
// @ts-ignore
await import("prismjs/components/prism-sql");
// @ts-ignore
await import("prismjs/components/prism-swift");
// @ts-ignore
await import("prismjs/components/prism-toml");
// @ts-ignore
await import("prismjs/components/prism-typescript");
// @ts-ignore
await import("prismjs/components/prism-vim");
// @ts-ignore
await import("prismjs/components/prism-yaml");
// @ts-ignore
await import("prismjs/components/prism-zig");

interface SnippetViewProps {
  snippet: Snippet;
}

export function SnippetView({ snippet }: SnippetViewProps) {
  const { colorMode } = useColorMode();
  return (
    <Container maxW="4xl" marginBottom="3.0rem">
      <Box
        borderWidth="3px"
        borderRadius="md"
        padding="0.2rem"
        borderColor={{ base: "gray.200", _dark: "gray.800" }}
        width="100%"
      >
        <Box width="100%">
          <VStack width="100%">
            <HStack
              width="100%"
              background={{ base: "gray.200", _dark: "gray.800" }}
              padding="0.5rem"
            >
              <HStack width="90%">
                <Icon
                  fontSize="2xl"
                  color="gray.500"
                  padding="0.1rem"
                  margin="0.1rem"
                >
                  <HiOutlineDocumentText />
                </Icon>
                <ChakraLink colorPalette="teal" fontWeight="bold" asChild>
                  <Link to={`/user/${snippet.authorHandle}`}>
                    {snippet.authorHandle}
                  </Link>
                </ChakraLink>
                <Text>/</Text>
                <ChakraLink asChild>
                  <Link
                    to={`/user/${snippet.authorHandle}/snippet/${snippet.rkey}`}
                  >
                    {snippet.title}
                  </Link>
                </ChakraLink>
              </HStack>
              <HStack width="10%">
                <Box width="100%" textAlign="right">
                  <IconButton
                    variant="surface"
                    size="xs"
                    title="Copy permalink"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${import.meta.env.VITE_PUBLIC_URL}/user/${snippet.authorDid}/snippet/${snippet.rkey}`
                      );
                    }}
                  >
                    <HiLink />
                  </IconButton>
                </Box>
              </HStack>
            </HStack>
            <Box width="100%">
              <Box padding="0.9rem" width="100%">
                {snippet.type == SnippetType.PlainText ? (
                  <Code
                    display="block"
                    whiteSpace="pre-wrap"
                    backgroundColor="transparent"
                    overflow="auto"
                    fontSize="sm"
                  >
                    {snippet.body}
                  </Code>
                ) : snippet.type == SnippetType.Markdown ? (
                  <div id="markdown">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {snippet.body}
                    </Markdown>
                  </div>
                ) : (
                  <Highlight
                    language={prismLangMap.get(snippet.type) ?? ""}
                    code={snippet.body}
                    theme={
                      colorMode === "dark" ? themes.vsDark : themes.vsLight
                    }
                  >
                    {({ style, tokens, getLineProps, getTokenProps }) => (
                      <Code
                        padding={0}
                        rounded="md"
                        display="block"
                        whiteSpace="pre"
                        backgroundColor="transparent"
                        overflow="auto"
                        fontSize="sm"
                      >
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({ line })}>
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                          </div>
                        ))}
                      </Code>
                    )}
                  </Highlight>
                )}
              </Box>
            </Box>
          </VStack>
        </Box>
      </Box>
    </Container>
  );
}
