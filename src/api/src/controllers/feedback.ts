import { FeedbackItem } from "../models/feedbackItem";
import { SubmittedFeedback } from "../models/submittedFeedback";
import { loadCsvData } from "../services/csvLoader";
import { uploadFeedback } from "../services/blobStorageClient";
import { NotFoundError } from "../models/notFoundError";


export const getFeedbackIds = async (version: string): Promise<{ id: string }[]> => {
    const data = await loadCsvData(version);
    return data.map((item) => ({ id: item.id })) as { id: string }[];
}

export const getFeedbackItem = async (version: string, id: string): Promise<FeedbackItem | undefined> => {
    const data = await loadCsvData(version);
    return data.find((item) => item.id === id) as (FeedbackItem | undefined);
}


export const submitFeedback = async (version: string, sessionId: string, submitFeedback: SubmittedFeedback): Promise<void> => {
    const data = await loadCsvData(version);
    const feedbackItem = data.find((item) => item.id === submitFeedback.id);

    if (!feedbackItem) {
        throw new NotFoundError("Feedback item not found.");
    }

    feedbackItem.feedback = submitFeedback.feedback;
    feedbackItem.rating = submitFeedback.rating;
    await uploadFeedback(sessionId, feedbackItem);
}
