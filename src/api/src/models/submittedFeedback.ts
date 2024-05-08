import { Rating } from './feedbackItem';

export interface SubmittedFeedback {
    id: string;
    feedback: string;
    rating: Rating;
}
