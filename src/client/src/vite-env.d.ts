/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_URL: string;
  readonly VITE_TRPC_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
