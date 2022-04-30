/**
 * Required External Modules
 */
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import Graph from "./structures/Graph";
import { namesRouter } from "./routes/names.router";
import { pathRouter } from "./routes/path.router";

dotenv.config();

/**
 * App Variables
 */

if (!process.env.PORT) process.exit(1);

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

export const mainGraph = new Graph();

/**
 *  App Configuration
 */

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/names", namesRouter);
app.use("/api/path", pathRouter);

/**
 * Server Activation
 */

app.listen(PORT, async () => {
  await mainGraph.read();
  console.log("Read File");
  console.log(`Listening on port ${PORT}`);
});
