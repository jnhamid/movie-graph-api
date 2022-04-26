import { Queue, Stack } from "./Structures";
import fs from "fs";
import path from "path";
import parse from "csv-parser";

interface HashTable<T> {
  [key: string]: T;
}

export default class Graph {
  public graph: Map<string, Set<string>>;
  // Construct Graph
  constructor() {
    this.graph = new Map<string, Set<string>>();
  }

  // Add edges
  public addEgde(a1: string, a2: string) {
    if (a1 === a2) {
      return;
    } else {
      // Get node and create link to other node
      if (this.graph.has(a1)) {
        this.graph.get(a1)?.add(a2);
      } else {
        const h1 = new Set<string>();
        h1.add(a2);
        this.graph.set(a1, h1);
      }
      if (this.graph.has(a2)) {
        this.graph.get(a2)?.add(a1);
      } else {
        const h2 = new Set<string>();
        h2.add(a1);
        this.graph.set(a2, h2);
      }
    }
  }

  public async read(): Promise<void> {
    try {
      const csvPath = path.resolve(__dirname, "../../tmdb_5000_credits.csv");

      console.log(csvPath);
      const parser = fs.createReadStream(csvPath).pipe(parse());
      for await (const record of parser) {
        const actors: string[] = [];
        const castArray = JSON.parse(record.cast);
        for (let cast of castArray) {
          const name = cast.name;
          actors.push(name);
          for (let cast2 of castArray) {
            const name2: string = cast2.name;
            if (!(name.toLowerCase() === name2.toLowerCase())) {
              this.addEgde(name.toLowerCase(), name2.toLowerCase());
            }
          }
        }
      }
      return;
    } catch (error) {
      console.error(error);
    }
    return;
  }
  // My own BFS
  public BFS(start: string, end: string) {
    if (!this.graph.has(start) || !this.graph.has(end)) {
      console.log("No Such Actor");
      return;
    } else {
      const lookup = [];
      const queue = new Queue<string>();
      let path: HashTable<string> = {};
      // To hold the correct path
      path[start] = "p";
      // put start path to placeholder
      queue.add(start);
      lookup.push(start);
      while (!queue.contains(end)) {
        const actor = queue.removeFirst();
        if (actor) {
          const contactList = this.graph.get(actor);
          if (contactList) {
            for (const contact of contactList) {
              // add path
              if (!lookup.includes(contact)) {
                lookup.push(contact);
                queue.add(contact);
                path[contact] = actor;
                // end if you got path
                if (contact === end) {
                  console.log(
                    "Shortest Path between " + start + " and " + end + ": "
                  );
                  if (!path[end]) {
                    path[end] = actor;
                  }
                }
              }
            }
          }
        }
      }
      // Put path into stack and pop to print in correct order
      let person = path[end];
      let shortPath = new Stack<string>();
      const shortPathArr = [];
      do {
        shortPath.push(person);
        person = path[person];
      } while (!(person === "p"));
      while (!(shortPath.size() == 0)) {
        if (!(person === end)) {
          const poppedVal = shortPath.pop();
          if (poppedVal) {
            person = poppedVal;
            shortPathArr.push(person);
            // console.log(person + " -> ");
          }
        } else {
          shortPathArr.push(person);
          // console.log(person);
        }
      }
      shortPathArr.push(end);
      // console.log(end);

      console.log(shortPathArr.join(" -> "));
    }
  }
}
