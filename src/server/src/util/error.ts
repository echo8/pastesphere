import type { Response, Request, NextFunction } from "express";
import { TRPCError } from "@trpc/server";

export class ClientError extends TRPCError {
  constructor(message?: string, cause?: unknown) {
    super({ message: message, code: "BAD_REQUEST", cause: cause });
  }
}

export class ServerError extends TRPCError {
  constructor(message?: string, cause?: unknown) {
    super({ message: message, code: "INTERNAL_SERVER_ERROR", cause: cause });
  }
}

const INTERNAL_ERROR_MESSAGE = "Internal Server Error";

export const errorHandlerExpress =
  () => (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ClientError) {
      res.status(400);
      res.json({
        message: err.message,
      });
      return;
    }
    if (err instanceof ServerError) {
      console.log(err);
      res.status(500);
      res.json({
        message: INTERNAL_ERROR_MESSAGE,
      });
    }
    console.log("Unexpected error:", err);
    res.status(500);
    res.json({
      message: INTERNAL_ERROR_MESSAGE,
    });
  };
