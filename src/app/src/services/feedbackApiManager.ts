import axios from 'axios';

import { FeedbackItem } from '../models/feedbackItem';

const _BASE_URL = process.env.REACT_APP_API_URL || '';

export const getFeedbackIds = async (): Promise<string[]> => {
    const response = await axios.get(`${_BASE_URL}/v1/feedback/documents?select=id`);
    const data = response.data as { id: string }[];
    return data.map((item) => item.id);
};

export const getFeedback = async (id: string) => {
    const response = await axios.get(`${_BASE_URL}/v1/feedback/documents/${id}`);
    return response.data as FeedbackItem;
};

export const uploadFeedback = async (sessionId: string, id: string, feedback: string, rating: string) => {
    const headers = {
        "session-id": sessionId,
    };

    await axios.post(`${_BASE_URL}/api/feedback/documents/${id}/feedback`, { feedback, rating }, { headers: headers });
};
