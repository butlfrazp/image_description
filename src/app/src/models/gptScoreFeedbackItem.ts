import { Rating } from './enums/rating';


export interface GptScoreFeedbackItem {
    id: string;
    question: string;
    textAnswer: string;
    textLink: string[];
    imageLinks: string[];
    generatedAnswer: string;
    generatedImageUrls: string[];
    gptScore: number;
    gptScoreJustification: string;
    rating: Rating;
    feedback?: string;
}
