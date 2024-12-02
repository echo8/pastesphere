import { Box } from "@chakra-ui/react";
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
      : skipToken
  );

  return (
    <Box marginTop="3.0rem">{data ? <SnippetView snippet={data} /> : ""}</Box>
  );
}
