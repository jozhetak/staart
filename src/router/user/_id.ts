import { Request, Response } from "express";

export const GET = (req: Request, res: Response) => {
  res.json({ hello: "world" });
};

export const PUT = (req: Request, res: Response) => {
  res.json({ hello: "put" });
};
