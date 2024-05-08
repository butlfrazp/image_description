import { Router } from "express";
import { FeedbackItem } from "../models/feedbackItem";
import { getFeedbackIds, getFeedbackItem, submitFeedback } from "../controllers/feedback";
import { NotFoundError } from "../models/notFoundError";

const router = Router();

router.get("/ids", async (req, res) => {
    const feedbackIds = await getFeedbackIds();
    res.json(feedbackIds);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    let feedbackItem: FeedbackItem | undefined;
    try {
        feedbackItem = await getFeedbackItem(id);
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

router.post('/:id', async (req, res) => {
    const { feedback, rating } = req.body;
    const { id } = req.params;
    const sessionId = req.headers['session-id'] as string;

    if (!sessionId) {
        res.sendStatus(401);
        return;
    }

    try {
        await submitFeedback(sessionId, { id, feedback, rating });
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(500);
        return;
    }

    res.sendStatus(200);
});

export default router;
