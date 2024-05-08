import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";

import feedbackRouter from "./routes/feedback";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/feedback", feedbackRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});