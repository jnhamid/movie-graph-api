/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import { mainGraph } from "../app";

/**
 * Router Definition
 */

export const namesRouter = express.Router();

/**
 * Controller Definitions
 */
namesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const names: Set<string> = new Set<string>([...mainGraph.graph.keys()]); //Get all names;

    const namesArr: string[] = [...names];

    console.log(names.size);

    res.status(200).send(JSON.stringify(namesArr));
  } catch (error) {
    res.status(500).send(`Server Error Something with Wrong: 
        ${error}
    `);
  }
});
