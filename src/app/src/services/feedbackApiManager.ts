import axios from 'axios';

import { FeedbackItem } from '../models/feedbackItem';

const _BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const getFeedbackIds = async (): Promise<string[]> => {
    const response = await axios.get(`${_BASE_URL}/api/feedback/ids`);
    return response.data as string[];
};

export const getFeedback = async (id: string) => {
    const response = await axios.get(`${_BASE_URL}/api/feedback/${id}`);
    return response.data as FeedbackItem;
};

export const uploadFeedback = async (sessionId: string, id: string, feedback: string, rating: string) => {
    const headers = {
        "session-id": sessionId,
    };

    await axios.post(`${_BASE_URL}/api/feedback/${id}`, { feedback, rating }, { headers: headers });
};
