export enum Rating {
    UNKNOWN = 'UNKNOWN',
    THUMBS_UP = 'THUMBS_UP',
    THUMBS_DOWN = 'THUMBS_DOWN',
}

export interface GptScoreFeedbackItem {
    id: string;
    question: string;
    textAnswer: string;
    textLink: string[];
    imageLinks: string[];
    generatedAnswer: string;
    gptScore: number;
    gptScoreJustification: string;
    score?: number;
    feedback?: string;
}
