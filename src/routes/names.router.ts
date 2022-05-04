/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import Fuse from "fuse.js";
import { mainGraph } from "../app";

interface nameType {
  value: string;
  label: string;
}

/**
 * Router Definition
 */

export const namesRouter = express.Router();

const options = {
  keys: ["value"],
};

/**
 * Controller Definitions
 */
namesRouter.get("/", async (req: Request, res: Response) => {
  try {
    //check for query parameters

    const { search } = req.query;
    const names: Set<string> = new Set<string>([...mainGraph.graph.keys()]); //Get all names;
    let namesArr: nameType[] = [...names].map((name) => {
      return {
        value: name.trim(),
        label: name
          .trim()
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      };
    });

    const fuse = new Fuse(namesArr, options);

    if (search) {
      namesArr = [...fuse.search(search as string)].map((item) => item.item);
    }

    namesArr.length = Math.min(namesArr.length, 100);

    res.status(200).send(JSON.stringify(namesArr));
  } catch (error) {
    res.status(500).send(`Server Error Something with Wrong: 
         ${error}
     `);
  }
});

namesRouter.get("/graph", async (req: Request, res: Response) => {
  try {
    //check for query parameters
    let nodes: any[] = [];
    let links: any[] = [];

    let names: string[] = [...mainGraph.graph.keys()];
    names = names.sort(() => 0.5 - Math.random());

    names.length = 3;

    let nodeSet = new Set<string>(names);

    for (let name of names) {
      const actorsSet = mainGraph.graph.get(name);
      if (actorsSet) {
        const actorArr = [...actorsSet];
        for (let actor of actorArr) {
          const link = { source: name, target: actor.name };
          if (!nodeSet.has(actor.name)) {
            nodeSet.add(actor.name);
          }
          links.push(link);
        }
      }
    }

    nodes = [...nodeSet].map((node) => {
      return { id: node, name: node };
    });
    console.log(nodes.length, links.length);
    res.status(200).send(JSON.stringify({ nodes, links }));
  } catch (error) {
    res.status(500).send(`Server Error Something with Wrong: 
         ${error}
     `);
  }
});

namesRouter.get("/graph2", async (req: Request, res: Response) => {
  try {
    //check for query parameters
    let nodes: any[] = [];
    let links: any[] = [];

    let names: string[] = [...new Set<string>([...mainGraph.graph.keys()])];

    names = names.sort(() => 0.5 - Math.random());

    names.length = 1300;

    nodes = names.map((name) => {
      return { id: name, name };
    });

    for (let name of names) {
      const actorsSet = mainGraph.graph.get(name);

      if (actorsSet) {
        const actorArr = [...actorsSet];
        for (let actor of actorArr) {
          const link = { source: name, target: actor.name };
          if (names.includes(actor.name)) links.push(link);
        }
      }
    }
    console.log(links.length);
    res.status(200).send(JSON.stringify({ nodes, links }));
  } catch (error) {
    res.status(500).send(`Server Error Something with Wrong: 
        ${error}
    `);
  }
});
