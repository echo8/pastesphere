import { Box, Heading, Highlight } from "@chakra-ui/react";
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
    </Box>
  );
}
