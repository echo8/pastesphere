import { useEffect, useState } from "react";
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
import { Skeleton } from "./ui/skeleton";
import { HiOutlineDocumentText, HiLink } from "react-icons/hi2";
import { Link } from "react-router";
import { Highlight, themes, Prism } from "prism-react-renderer";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Snippet } from "../types";
import { loadStyles, prismLangMap } from "../utils/prism";
import { SnippetType } from "../../../server/src/types";

(typeof global !== "undefined" ? global : window).Prism = Prism;

interface SnippetViewProps {
  snippet: Snippet;
}

export function SnippetView({ snippet }: SnippetViewProps) {
  const { colorMode } = useColorMode();
  const [stylesLoaded, setStylesLoaded] = useState(false);

  useEffect(() => {
    loadStyles(snippet.type).then((res) => {
      setStylesLoaded(true);
    });
  }, []);

  return stylesLoaded ? (
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
  ) : (
    <Container maxW="4xl" marginTop="3.0rem">
      <Skeleton height="7.0rem" />
    </Container>
  );
}
