import axios from 'axios';

import { FeedbackItem } from '../models/feedbackItem';

const _BASE_URL = process.env.REACT_APP_API_URL || '';

export const getFeedbackIds = async (version: string): Promise<string[]> => {
    const response = await axios.get(`${_BASE_URL}/image-feedback/feedback/${version}/documents?select=id`);
    const data = response.data as { id: string }[];
    return data.map((item) => item.id);
};

export const getFeedback = async (version: string, id: string) => {
    const response = await axios.get(`${_BASE_URL}/image-feedback/feedback/${version}/documents/${id}`);
    return response.data as FeedbackItem;
};

export const uploadFeedback = async (version: string, sessionId: string, id: string, feedback: string, rating: string) => {
    const headers = {
        "session-id": sessionId,
    };

    await axios.post(`${_BASE_URL}/image-feedback/feedback/${version}/documents/${id}/feedback`, { feedback, rating }, { headers: headers });
};
