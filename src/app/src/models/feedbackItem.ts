export enum Rating {
    UNKNOWN = 'UNKNOWN',
    THUMBS_UP = 'THUMBS_UP',
    THUMBS_DOWN = 'THUMBS_DOWN',
}

export interface FeedbackItem {
    id: string;
    imageUrl: string;
    description: string;
    rating: Rating;
    feedback: string;
    imageData: string;
}