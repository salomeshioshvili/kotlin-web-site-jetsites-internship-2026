import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createRequestHandler } from "@react-router/express";
import * as serverBuild from "./build/server/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port = process.env.PORT ? Number(process.env.PORT) : 9000;
const host = process.env.HOST || "0.0.0.0";

const projectRoot = path.resolve(__dirname);
const clientDir = path.join(projectRoot, "build", "client");
const assetsDir = path.join(projectRoot, "assets");

// Serve Vite-built client assets (hashed files, CSS, JS, etc).
app.use(express.static(clientDir));

// Serve legacy static assets referenced via absolute URLs like `/assets/...`.
app.use("/assets", express.static(assetsDir));

// React Router SSR for all other routes.
app.all("*", createRequestHandler({ build: serverBuild }));

app.listen(port, host, () => {
  console.log(`[server] http://${host}:${port}`);
});

