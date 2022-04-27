import { Queue, Stack } from "./Structures";
import fs from "fs";
import path from "path";
import parse from "csv-parser";

interface HashTable<T> {
  [key: string]: T;
}

interface actorNode {
  name: string;
  movie_id: string;
}

export default class Graph {
  public graph: Map<string, Set<actorNode>>;
  // Construct Graph
  constructor() {
    this.graph = new Map<string, Set<actorNode>>();
  }

  // Add edges
  public addEgde(a1: string, a2: actorNode) {
    if (a1 === a2.name) {
      return;
    } else {
      // Get node and create link to other node
      if (this.graph.has(a1)) {
        this.graph.get(a1)?.add(a2);
      } else {
        const h1 = new Set<actorNode>();
        h1.add(a2);
        this.graph.set(a1, h1);
      }
      if (this.graph.has(a2.name)) {
        this.graph
          .get(a2.name)
          ?.add({ name: a1, movie_id: a2.movie_id } as actorNode);
      } else {
        const h2 = new Set<actorNode>();
        h2.add({ name: a1, movie_id: a2.movie_id } as actorNode);
        this.graph.set(a2.name, h2);
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
        const movie_id = record.movie_id;
        for (let cast of castArray) {
          const name = cast.name;
          actors.push(name);
          for (let cast2 of castArray) {
            const name2: string = cast2.name;
            if (!(name.toLowerCase() === name2.toLowerCase())) {
              this.addEgde(name.toLowerCase(), {
                name: name2.toLowerCase(),
                movie_id,
              } as actorNode);
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
  public BFS(start: string, end: string): any[] {
    if (!this.graph.has(start) || !this.graph.has(end)) {
      console.log("No Such Actor");
      return [];
    } else {
      const lookup = [];
      const queue = new Queue<string>();
      // To hold the correct path
      let path: HashTable<actorNode> = {};
      // put start path to placeholder
      path[start] = { name: "p", movie_id: "-1" } as actorNode;
      queue.add(start);
      lookup.push(start);
      while (!queue.contains(end)) {
        const actor = queue.removeFirst();
        if (actor) {
          const contactList = this.graph.get(actor);
          if (contactList) {
            for (const contact of contactList) {
              // add path
              if (!lookup.includes(contact.name)) {
                lookup.push(contact.name);
                queue.add(contact.name);
                path[contact.name] = {
                  name: actor,
                  movie_id: contact.movie_id,
                } as actorNode;
                // end if you got path
                if (contact.name === end) {
                  console.log(
                    "Shortest Path between " + start + " and " + end + ": "
                  );
                  if (!path[end]) {
                    path[end] = {
                      name: actor,
                      movie_id: contact.movie_id,
                    } as actorNode;
                  }
                }
              }
            }
          }
        }
      }
      // Put path into stack and pop to print in correct order
      let person = path[end];
      let shortPath = new Stack<actorNode>();
      const shortPathArr = [];
      do {
        shortPath.push(person);
        person = path[person.name];
      } while (!(person.name === "p"));
      while (!(shortPath.size() == 0)) {
        if (!(person.name === end)) {
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

      return shortPathArr;
    }
  }
}
