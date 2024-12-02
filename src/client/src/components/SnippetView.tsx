import {
  Box,
  HStack,
  VStack,
  Text,
  Container,
  Icon,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { Link } from "react-router";
import { Snippet } from "../types";

interface SnippetViewProps {
  snippet: Snippet;
}

export function SnippetView({ snippet }: SnippetViewProps) {
  return (
    <Container maxW="4xl" marginBottom="3.0rem">
      <VStack width="100%">
        <HStack width="100%">
          <Icon
            fontSize="2xl"
            color="gray.500"
            padding="0.1rem"
            margin="0.1rem"
          >
            <HiOutlineDocumentText />
          </Icon>
          <ChakraLink colorPalette="teal" asChild>
            <Link to={`/user/${snippet.authorHandle}`}>
              {snippet.authorHandle}
            </Link>
          </ChakraLink>
          <Text>/</Text>
          <ChakraLink asChild>
            <Link to={`/user/${snippet.authorHandle}/snippet/${snippet.rkey}`}>
              {snippet.title}
            </Link>
          </ChakraLink>
        </HStack>
        <Box borderWidth="1px" borderRadius="sm" padding="0.2rem" width="100%">
          <Box background="gray.900" padding="0.5rem" width="100%">
            <Text fontFamily="monospace" fontSize="md">
              {snippet.body}
            </Text>
          </Box>
        </Box>
      </VStack>
    </Container>
  );
}
