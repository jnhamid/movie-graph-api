/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";

/**
 * Router Definition
 */

export const pathRouter = express.Router();

/**
 * Controller Definitions
 */

pathRouter.get("/", async (req: Request, res: Response) => {
  try {
    //get path

    res.status(200).send();
  } catch (error) {
    res.status(500).send(`Something went wrong: 
        ${error}
      `);
  }
});
