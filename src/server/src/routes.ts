import express, { Request, Response } from "express";
import { AppContext } from "./types";

const handler =
  (fn: express.Handler) =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };

export const createRouter = (ctx: AppContext) => {
  const router = express.Router();

  router.get(
    "/hello1",
    handler(async (_, res) => {
      res.send("Hello1");
    })
  );

  return router;
};
