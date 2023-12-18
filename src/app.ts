import express from "express";
import type { Express } from "express";
import cors from "cors";

/** Create a basic express application */
export function makeApp(): Express {
  const app = express();
  app.use(cors());
  return app;
}
