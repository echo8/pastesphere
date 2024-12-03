import { Box, Center, Text } from "@chakra-ui/react";
import { useParams } from "react-router";
import { skipToken } from "@tanstack/react-query";
import { SnippetView } from "@/components/SnippetView";
import { trpc } from "@/utils/trpc";

export function UserPage() {
  const { handle } = useParams();
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    trpc.snippet.getForUser.useInfiniteQuery(
      handle
        ? {
            handle: handle,
          }
        : skipToken,
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const handleScroll = () => {
    if (
      document.body.scrollHeight - 300 < window.scrollY + window.innerHeight &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  window.addEventListener("scroll", handleScroll);

  return (
    <Box>
      {data?.pages.map((page, i) => {
        return (
          <Box marginTop="3.0rem" key={i}>
            {page.snippets.map((snippet) => {
              return <SnippetView key={snippet.rkey} snippet={snippet} />;
            })}
          </Box>
        );
      })}
      {isFetchingNextPage ? (
        <Center>
          <Text>Loading...</Text>
        </Center>
      ) : (
        ""
      )}
    </Box>
  );
}
