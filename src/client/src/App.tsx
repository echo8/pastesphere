import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { trpc } from "@/utils/trpc";
import { FrontPage } from "@/pages/FrontPage";
import { UserPage } from "@/pages/UserPage";
import { SnippetPage } from "@/pages/SnippetPage";

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://pastesphere.localhost:2022/trpc",
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route index element={<FrontPage />} />
          <Route path="user/:handle" element={<UserPage />} />
          <Route path="user/:handle/snippet/:rkey" element={<SnippetPage />} />
        </Routes>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
