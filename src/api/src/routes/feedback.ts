import { Router } from "express";
import { FeedbackItem } from "../models/feedbackItem";
import { getFeedbackIds, getFeedbackItem, submitFeedback } from "../controllers/feedback";
import { NotFoundError } from "../models/notFoundError";

const router = Router();

router.get("/:version/documents", async (req, res) => {
    const { version } = req.params;

    try {
        const feedbackIds = await getFeedbackIds(version);
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

    let feedbackItem: FeedbackItem | undefined;
    try {
        feedbackItem = await getFeedbackItem(version, id);
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
    const { feedback, rating } = req.body;
    const { version, id } = req.params;
    const sessionId = req.headers['session-id'] as string;

    if (!sessionId) {
        res.sendStatus(401);
        return;
    }

    console.log(`Submitting feedback for ${id}`)
    try {
        await submitFeedback(version, sessionId, { id, feedback, rating });
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(500);
        return;
    }

    console.log(`Feedback submitted for ${id}`);
});

export default router;
