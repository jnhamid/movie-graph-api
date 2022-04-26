/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";

/**
 * Router Definition
 */

export const namesRouter = express.Router();

/**
 * Controller Definitions
 */
namesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const names: string[] = []; //Get all names;

    res.status(200).send(names);
  } catch (error) {
    res.status(500).send(`Server Error Something with Wrong: 
        ${error}
    `);
  }
});
