import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import feedbackRouter from "./routes/feedback";

const _BUILD_PATH = path.resolve(__dirname, "build");

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/feedback", feedbackRouter);

if (process.env.NODE_ENV?.toLowerCase() === "production") {
  app.use(express.static(_BUILD_PATH));
}

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});