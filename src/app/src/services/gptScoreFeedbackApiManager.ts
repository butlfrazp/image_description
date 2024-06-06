import axios from 'axios';
import { GptScoreFeedbackItem } from '../models/gptScoreFeedbackItem';


const _BASE_URL = process.env.REACT_APP_API_URL || '';

export const getFeedbackIds = async (version: string): Promise<string[]> => {
    const response = await axios.get(`${_BASE_URL}/image-feedback/feedback/gpt-score/${version}/documents?select=id`);
    const data = response.data as { id: string }[];
    return data.map((item) => item.id);
};

export const getFeedback = async (version: string, id: string) => {
    const response = await axios.get(`${_BASE_URL}/image-feedback/feedback/gpt-score/${version}/documents/${id}`);
    return response.data as GptScoreFeedbackItem;
};

export const uploadFeedback = async (version: string, sessionId: string, id: string, feedback: string, note: string, score: number) => {
    const headers = {
        "session-id": sessionId,
    };

    await axios.post(`${_BASE_URL}/image-feedback/feedback/gpt-score/${version}/documents/${id}/feedback`, { feedback, note, score }, { headers: headers });
};
