import { Box } from "@chakra-ui/react";
import { useParams } from "react-router";
import { SnippetView } from "@/components/SnippetView";
import { trpc } from "@/utils/trpc";

export function UserPage() {
  const { handle } = useParams();
  const { data, isPending } = trpc.snippet.getForUser.useQuery({
    handle: handle!,
  });

  return (
    <Box>
      {data?.map((snippet) => {
        return <Box marginTop="3.0rem" key={snippet.rkey}><SnippetView snippet={snippet} /></Box>;
      })}
    </Box>
  );
}
