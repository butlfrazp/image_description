import { useEffect, useMemo, useState } from "react";
import { Rating } from "../models/enums/rating";
import { GptScoreFeedbackItem } from "../models/gptScoreFeedbackItem";
import * as gptScoreFeedbackApiManager from "../services/gptScoreFeedbackApiManager";


export const useGptScoreFeedback = (version: string) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [gptScoreFeedbackItem, setGptScoreFeedbackItem] = useState<GptScoreFeedbackItem | undefined>();
    const [gptScoreFeedbackIds, setGptScoreFeedbackIds] = useState<string[] | undefined>();
    const [versionExists, setVersionExists] = useState<boolean | undefined>(undefined);


    useEffect(() => {
        console.log("Fetching feedback ids...");
        (async () => {
            try {
                const ids = await getFeedbackIds();
                setGptScoreFeedbackIds(ids);
                setVersionExists(true);
            } catch (err) {
                setVersionExists(false);
            }
        })();
    }, []);

    useEffect(() => {
        console.log(`In use effect... ${gptScoreFeedbackItem}`)
        if (!gptScoreFeedbackItem && gptScoreFeedbackIds && gptScoreFeedbackIds.length > 0) {
            console.log("Getting feedback item...")
            getFeedbackItem();
        }
    }, [gptScoreFeedbackItem, gptScoreFeedbackIds]);

    const getFeedbackIds = async () => {
        const ids = await gptScoreFeedbackApiManager.getFeedbackIds(version);
        return ids;
    }

    const getFeedbackItem = async () => {
        console.log("Fetching feedback item...");
        if (!gptScoreFeedbackIds) {
            return;
        }

        setLoading(true);

        // get a random feedback id
        const randomIndex = Math.floor(Math.random() * gptScoreFeedbackIds.length);
        const randomId = gptScoreFeedbackIds[randomIndex];

        let data: GptScoreFeedbackItem;
        try {
            data = await gptScoreFeedbackApiManager.getFeedback(version, randomId);
        } finally {
            setLoading(false);
        }

        setGptScoreFeedbackItem(data);
    }

    const submitFeedback = async (sessionId: string, feedback: string, note: string, score: number) => {
        if (!gptScoreFeedbackItem) {
            return;
        }

        setLoading(true);
        try {
            await gptScoreFeedbackApiManager.uploadFeedback(version, sessionId, gptScoreFeedbackItem.id, feedback, note, score);
        } finally {
            setLoading(false);
        }

        setGptScoreFeedbackIds(gptScoreFeedbackIds?.filter((id) => id !== gptScoreFeedbackItem?.id));
        setGptScoreFeedbackItem(undefined);
    }

    const skipFeedbackItem = () => {
        setGptScoreFeedbackIds(gptScoreFeedbackIds?.filter((id) => id !== gptScoreFeedbackItem?.id));
        setGptScoreFeedbackItem(undefined);
    }

    const isLoading = useMemo(
        () => (versionExists === undefined || ((loading || !gptScoreFeedbackItem) && (gptScoreFeedbackIds ?? []).length > 0)),
        [versionExists, loading, gptScoreFeedbackItem, gptScoreFeedbackIds]
    );

    return { gptScoreFeedbackIds, isLoading, gptScoreFeedbackItem, getFeedbackItem, submitFeedback, skipFeedbackItem, versionExists };
}