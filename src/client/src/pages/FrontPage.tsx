import { LoginForm } from "@/components/LoginForm";
import { Box, Heading, Highlight, Center, Text } from "@chakra-ui/react";
import { trpc } from "@/utils/trpc";
import { User } from "../types";
import { SnippetForm } from "@/components/SnippetForm";

export function FrontPage() {
  const { data: user } = trpc.getCurrentUser.useQuery<User>();

  return (
    <Box>
      <Box background="gray.900" padding="0.5rem">
        <Heading size="3xl" letterSpacing="tight">
          <Highlight query="paste" styles={{ color: "teal.600" }}>
            pastesphere
          </Highlight>
        </Heading>
      </Box>
      <Box margin="4rem">
        <Center>
          <Text textStyle="xl">
            Share text, code and more on the ATmosphere!
          </Text>
        </Center>
      </Box>
      {user?.isLoggedIn ? <SnippetForm user={user} /> : <LoginForm />}
    </Box>
  );
}
