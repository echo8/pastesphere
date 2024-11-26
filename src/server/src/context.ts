import { createClient } from "./auth/client";
import { AppContext } from "./types";

export const createContext = async (): Promise<AppContext> => {
  const oauthClient = await createClient();
  return {
    oauthClient: oauthClient,
  };
};
