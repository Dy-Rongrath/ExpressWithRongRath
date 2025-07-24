import { Request, Response } from "express";

/**
 * Gets the profile of the currently authenticated user.
 */
export const getMyProfile = (req: Request, res: Response) => {
  res.status(200).json(req.user);
};
