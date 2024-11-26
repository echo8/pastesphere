import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../server/src/routes";

export const trpc = createTRPCReact<AppRouter>();
