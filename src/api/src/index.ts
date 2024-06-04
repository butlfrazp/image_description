import express, { Express, Request, Response, NextFunction, ErrorRequestHandler } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import feedbackRouter from "./routes/feedback";
import gptScoreFeedbackRouter from "./routes/gptScoreFeedback";
import { NotFoundError } from "./models/notFoundError";

const _BUILD_PATH = path.resolve(__dirname, "build");

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.use("/image-feedback/feedback/image", feedbackRouter);
app.use("/image-feedback/feedback/gpt-score", gptScoreFeedbackRouter);

if (process.env.NODE_ENV?.toLowerCase() === "production") {
  app.use(express.static(_BUILD_PATH));
}

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("Error middleware")
    if (err instanceof NotFoundError) {
        res.sendStatus(404);
        return;
    }

    res.sendStatus(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});