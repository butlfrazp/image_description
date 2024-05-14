import { useEffect, useState } from "react";
import { FeedbackItem, Rating } from "../models/feedbackItem";
import * as feedbackApiManager from "../services/feedbackApiManager";


export const useFeedback = (version: string) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [feedbackItem, setFeedbackItem] = useState<FeedbackItem | undefined>();
    const [feedbackIds, setFeedbackIds] = useState<string[] | undefined>();
    const [versionExists, setVersionExists] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        console.log("Fetching feedback ids...");
        (async () => {
            try {
                const ids = await getFeedbackIds();
                setFeedbackIds(ids);
                setVersionExists(true);
            } catch (err) {
                setVersionExists(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (!feedbackItem && feedbackIds && feedbackIds.length > 0) {
            getFeedbackItem();
        }
    }, [feedbackItem, feedbackIds]);

    const getFeedbackIds = async () => {
        const ids = await feedbackApiManager.getFeedbackIds(version);
        return ids;
    }

    const getFeedbackItem = async () => {
        console.log("Fetching feedback item...");
        if (!feedbackIds) {
            return;
        }

        setLoading(true);

        // get a random feedback id
        const randomIndex = Math.floor(Math.random() * feedbackIds.length);
        const randomId = feedbackIds[randomIndex];

        let data: FeedbackItem;
        try {
            data = await feedbackApiManager.getFeedback(version, randomId);
        } finally {
            setLoading(false);
        }

        setFeedbackItem(data);
    }

    const submitFeedback = async (sessionId: string, feedback: string, rating: Rating) => {
        if (!feedbackItem) {
            return;
        }

        setLoading(true);
        try {
            await feedbackApiManager.uploadFeedback(version, sessionId, feedbackItem.id, feedback, rating);
        } finally {
            setLoading(false);
        }

        setFeedbackIds(feedbackIds?.filter((id) => id !== feedbackItem?.id));
        setFeedbackItem(undefined);
    }

    const skipFeedbackItem = () => {
        setFeedbackIds(feedbackIds?.filter((id) => id !== feedbackItem?.id));
        setFeedbackItem(undefined);
    }

    return { feedbackIds, loading, feedbackItem, getFeedbackItem, submitFeedback, skipFeedbackItem, versionExists };
}