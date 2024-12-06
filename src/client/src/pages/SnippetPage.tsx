import { Box, Container } from "@chakra-ui/react";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "react-router";
import { skipToken } from "@tanstack/react-query";
import { SnippetView } from "@/components/SnippetView";
import { trpc } from "@/utils/trpc";

export function SnippetPage() {
  const { handle, rkey } = useParams();
  const { data, isPending } = trpc.snippet.get.useQuery(
    handle && rkey
      ? {
          handle: handle,
          rkey: rkey,
        }
      : skipToken,
    { retry: (_, err) => err.data?.code !== "NOT_FOUND" }
  );

  return (
    <Box>
      {!isPending && !data ? (
        <Container maxW="4xl" marginTop="3.0rem">
          <Alert
            status="error"
            title="Sorry but we couldn't find this snippet."
            colorPalette="teal"
          />
        </Container>
      ) : isPending ? (
        <Container maxW="4xl" marginTop="3.0rem">
          <Skeleton height="7.0rem" />
        </Container>
      ) : (
        ""
      )}
      {data ? (
        <Box marginTop="3.0rem">
          <SnippetView snippet={data} />
        </Box>
      ) : (
        ""
      )}
    </Box>
  );
}
