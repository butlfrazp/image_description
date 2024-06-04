import { Rating } from './enums/rating';

export interface FeedbackItem {
    id: string;
    imageUrl: string;
    description: string;
    rating: Rating;
    feedback: string;
    imageData: string;
}