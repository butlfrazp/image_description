import { Router } from "express";
import { GptScoreFeedbackItem } from "../models/GptScoreFeedbackItem";
import { getGptScoreIds, getGptScoreFeedbackItem, submitGptScoreFeedback } from "../controllers/gpt_score_feedback";
import { NotFoundError } from "../models/notFoundError";

const router = Router();

router.get("/:version/documents", async (req, res) => {
    const { version } = req.params;

    try {
        const feedbackIds = await getGptScoreIds(version);
        res.json(feedbackIds);
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(500);
    }
});

router.get('/:version/documents/:id', async (req, res) => {
    const { version, id } = req.params;

    let feedbackItem: GptScoreFeedbackItem | undefined;
    try {
        feedbackItem = await getGptScoreFeedbackItem(version, id);
    } catch (err) {
        console.error(err);
        res.json({ message: "There was an error fetching the feedback item." }).sendStatus(400);
        return;
    }

    if (!feedbackItem) {
        res.sendStatus(404);
        return;
    }

    res.json(feedbackItem);
});

router.post('/:version/documents/:id', async (req, res) => {
    const { feedback, score }: { feedback: string, score: number } = req.body;
    const { version, id } = req.params;
    const sessionId = req.headers['session-id'] as string;

    if (!sessionId) {
        res.sendStatus(401);
        return;
    }

    console.log(`Submitting feedback for ${id}`)
    try {
        await submitGptScoreFeedback(version, sessionId, { id, feedback, score });
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(500);
    }
    console.log(`Feedback submitted for ${id}`)
    res.sendStatus(200);
});


export default router;
