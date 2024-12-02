import { Box } from "@chakra-ui/react";
import { useParams } from "react-router";
import { SnippetView } from "@/components/SnippetView";
import { trpc } from "@/utils/trpc";

export function SnippetPage() {
  const { handle, rkey } = useParams();
  const { data, isPending } = trpc.snippet.get.useQuery({
    handle: handle!,
    rkey: rkey!,
  });

  return (
    <Box marginTop="3.0rem">{data ? <SnippetView snippet={data} /> : ""}</Box>
  );
}
