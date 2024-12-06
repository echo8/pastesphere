import { Box, Center, Text, Container } from "@chakra-ui/react";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "react-router";
import { skipToken } from "@tanstack/react-query";
import { SnippetView } from "@/components/SnippetView";
import { trpc } from "@/utils/trpc";
import { useState, useEffect } from "react";

export function UserPage() {
  const { handle } = useParams();
  const [loading, setLoading] = useState(false);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchedAfterMount,
  } = trpc.snippet.getForUser.useInfiniteQuery(
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
      setLoading(true);
    }
  };

  window.addEventListener("scroll", handleScroll);

  useEffect(() => {
    if (loading == true) {
      fetchNextPage();
    }
  }, [loading]);

  useEffect(() => {
    setLoading(false);
  }, [data]);

  return (
    <Box>
      {!isFetching &&
      (!data ||
        data?.pages.length == 0 ||
        data?.pages.map((p) => p.snippets.length).reduce((p, c) => p + c) ==
          0) ? (
        <Container maxW="4xl" marginTop="3.0rem">
          <Alert
            status="info"
            title="We couldn't find any snippets for this user."
            colorPalette="teal"
          />
        </Container>
      ) : !isFetchedAfterMount ? (
        <Container maxW="4xl" marginTop="3.0rem">
          <Skeleton height="5.0rem" marginBottom="3.0rem" />
          <Skeleton height="5.0rem" marginBottom="3.0rem" />
          <Skeleton height="5.0rem" marginBottom="3.0rem" />
        </Container>
      ) : (
        ""
      )}
      {isFetchedAfterMount &&
        data?.pages.map((page, i) => {
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
