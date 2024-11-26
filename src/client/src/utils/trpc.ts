import { createTRPCReact } from "@trpc/react-query";
import type { TRPCRouter } from "../../../server/src";

export const trpc = createTRPCReact<TRPCRouter>();
