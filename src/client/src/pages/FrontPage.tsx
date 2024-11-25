import { LoginForm } from "@/components/LoginForm";
import { Box, VStack, Flex } from "@chakra-ui/react";

export function FrontPage() {
  return (
    <Box>
      <Box background="gray.900" padding="5px">
        pastesphere
      </Box>
      <Box margin="20px">
        <LoginForm />
      </Box>
    </Box>
  );
}
