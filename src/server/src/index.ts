import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createRouter } from "./routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 2022;

app.use(cors<Request>());

app.use(createRouter({}));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
