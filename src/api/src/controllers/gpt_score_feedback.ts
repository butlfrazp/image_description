import { GptScoreFeedbackItem } from "../models/GptScoreFeedbackItem";
import { loadGptScoreCsvData } from "../services/csvLoader";
import { NotFoundError } from "../models/notFoundError";
import { uploadGptScoreFeedback } from "../services/blobStorageClient";
import { GptScoreSubmittedFeedback } from "../models/gptScoreSubmittedFeedback";

export const getGptScoreIds = async (version: string): Promise<{ id: string }[]> => {
    const data = await loadGptScoreCsvData(version);
    return data.map((item) => ({ id: item.id })) as { id: string }[];
}

export const getGptScoreFeedbackItem = async (version: string, id: string): Promise<GptScoreFeedbackItem | undefined> => {
    const data = await loadGptScoreCsvData(version);
    return data.find((item) => item.id === id) as (GptScoreFeedbackItem | undefined);
}

export const submitGptScoreFeedback = async (version: string, sessionId: string, submitFeedback: GptScoreSubmittedFeedback): Promise<void> => {
    const data = await loadGptScoreCsvData(version);
    const feedbackItem = data.find((item) => item.id === submitFeedback.id);

    if (!feedbackItem) {
        throw new NotFoundError("Feedback item not found.");
    }

    feedbackItem.feedback = submitFeedback.feedback;
    feedbackItem.score = submitFeedback.score;
    await uploadGptScoreFeedback(sessionId, version, feedbackItem);
}
