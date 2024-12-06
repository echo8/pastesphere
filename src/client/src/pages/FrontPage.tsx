import { LoginForm } from "@/components/LoginForm";
import {
  Box,
  Center,
  Heading,
  HStack,
  Text,
  Container,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router";
import { skipToken } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { User } from "../types";
import { SnippetForm } from "@/components/SnippetForm";
import { SnippetView } from "@/components/SnippetView";

export function FrontPage() {
  const { data: user, isPending: isUserPending } =
    trpc.getCurrentUser.useQuery<User>();
  const {
    data: latestSnippets,
    isPending: isSnippetsPending,
    isFetchedAfterMount,
  } = trpc.snippet.getForUser.useQuery(
    user?.isLoggedIn ? { handle: user.handle } : skipToken
  );

  const loggedInView = (
    <Box>
      <Box>
        <SnippetForm user={user!} />
      </Box>
      {!isFetchedAfterMount ? (
        <Container maxW="4xl" marginTop="5.0rem">
          <Skeleton height="2.0rem" width="25%" marginBottom="1.0rem" />
          <Skeleton height="7.0rem" />
        </Container>
      ) : (
        ""
      )}
      {isFetchedAfterMount &&
        latestSnippets &&
        latestSnippets.snippets.length > 0 && (
          <Container maxW="4xl" marginTop="5.0rem">
            <HStack>
              <Heading width="50%">My Latest</Heading>
              <Text width="50%" textAlign="right">
                <ChakraLink variant="underline" asChild>
                  <Link to={`/user/${user?.handle}`}>View More</Link>
                </ChakraLink>
              </Text>
            </HStack>
          </Container>
        )}
      {isFetchedAfterMount &&
        latestSnippets?.snippets.map((snippet) => {
          return (
            <Box marginTop="2.0rem" key={snippet.rkey}>
              <SnippetView snippet={snippet} />
            </Box>
          );
        })}
    </Box>
  );

  return (
    <Box>
      <Box margin="4rem">
        <Center>
          <Text textStyle="xl">
            Share text, code and more on the ATmosphere!
          </Text>
        </Center>
      </Box>
      {isUserPending ? (
        <Container maxW="lg" marginBottom="3rem">
          <Skeleton height="5.0rem" />
        </Container>
      ) : user?.isLoggedIn ? (
        loggedInView
      ) : (
        <LoginForm />
      )}
    </Box>
  );
}
