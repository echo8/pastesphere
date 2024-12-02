import {
  Box,
  Center,
  Heading,
  Highlight,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link, Outlet } from "react-router";

export function MainLayout() {
  return (
    <Box>
      <Box background="gray.900" padding="0.5rem">
        <Link to="/">
          <Heading size="3xl" letterSpacing="tight">
            <Highlight query="paste" styles={{ color: "teal.600" }}>
              pastesphere
            </Highlight>
          </Heading>
        </Link>
      </Box>
      <Outlet />
      <Box marginTop="5.0rem" marginBottom="3.0rem">
        <Center>
          <Text color="fg.muted" textStyle="sm">
            © {new Date().getFullYear()}{" "}
            <ChakraLink variant="underline" href="https://www.github.com/echo8">
              echo8
            </ChakraLink>
          </Text>
        </Center>
      </Box>
    </Box>
  );
}
