import type { Request, Response, NextFunction } from "express";

// Kill server on error so that we can restart it.
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  process.exit(1);
};
