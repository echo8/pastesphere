import { LoginForm } from "@/components/LoginForm";
import { Box, VStack, Flex } from "@chakra-ui/react";
import { trpc } from "@/utils/trpc";

export function FrontPage() {
  const { data } = trpc.getUser.useQuery();
  return (
    <Box>
      <Box background="gray.900" padding="5px">
        pastesphere
      </Box>
      <Box margin="20px">
        { data?.isLoggedIn ? <div>Logged in!</div> : <LoginForm />}
      </Box>
    </Box>
  );
}
