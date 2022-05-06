/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import { mainGraph } from "../app";

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
    console.log(req.query.firstActor);
    const { firstActor, secondActor } = req.query;

    const pathArr = mainGraph.BFS(firstActor as string, secondActor as string);

    res.status(200).send(JSON.stringify([pathArr]));
  } catch (error) {
    res.status(500).send(`Something went wrong: 
        ${error}
      `);
  }
});
