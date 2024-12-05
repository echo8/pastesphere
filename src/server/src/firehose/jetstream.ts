import { Jetstream } from "@skyware/jetstream";
import type { CommitCreateEvent } from "@skyware/jetstream";
import pino from "pino";
import { LEXICON_ID } from "../service/snippet";
import { AppContext } from "../types";
import { env } from "../util/env";

const logger = pino({ name: "jetstream" });

export const createJetStream = (ctx: AppContext) => {
  const jetstream = new Jetstream({
    endpoint: env.JETSTREAM_ENDPOINT,
    wantedCollections: [LEXICON_ID],
  });

  jetstream.on("open", () => {
    logger.info(`Jetstream subscription started`);
  });

  jetstream.on("close", () => {
    logger.info(`Jetstream subscription closed`);
  });

  jetstream.on("error", (error) => {
    logger.error(
      {
        error: String(error),
      },
      "Jetstream error caught"
    );
  });

  jetstream.onCreate(
    LEXICON_ID,
    async (event: CommitCreateEvent<typeof LEXICON_ID>) => {
      try {
        await ctx.snippetService.sync(event);
      } catch (err) {
        logger.error({ error: err }, "Failed to sync create event");
      }
    }
  );

  return jetstream;
};
