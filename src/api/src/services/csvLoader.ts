import { parse } from "csv-parse";

import { FeedbackItem, Rating } from "../models/feedbackItem";
import { loadGptScoreDataset, loadImageDescriptionDataset } from "./blobStorageClient";
import { GptScoreFeedbackItem } from "../models/GptScoreFeedbackItem";


let _csvFeedbackItems: FeedbackItem[] | undefined = undefined;
const loadFeedbackCsv = async (csvData: string): Promise<FeedbackItem[]> => {
    if (_csvFeedbackItems) {
        return _csvFeedbackItems;
    }

    const parsedCsvData = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ","
    });

    const records: FeedbackItem[] = [];
    for await (const record of parsedCsvData) {
        const feedbackItem: FeedbackItem = {
            id: record.img_name,
            imageUrl: record.img_url,
            description: record.summary,
            rating: Rating.UNKNOWN,
            feedback: undefined
        };
        records.push(feedbackItem);
    }

    _csvFeedbackItems = records;
    return _csvFeedbackItems;
}

const loadGptScoreFeedbackCsv = async (csvData: string): Promise<GptScoreFeedbackItem[]> => {
    const parsedCsvData = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ","
    });

    const records: GptScoreFeedbackItem[] = [];
    let i = 0;
    for await (const record of parsedCsvData) {
        const feedbackItem: GptScoreFeedbackItem = {
            id: `${i}`,
            question: record["Question"],
            textAnswer: record["Text Answer"],
            textLink: JSON.parse(record["web_url"].replace(/'/g,"\"").replace(/"s/g,"'")),
            imageLinks: JSON.parse(record["Image link"].replace(/'/g,"\"").replace(/"s/g,"'")),
            generatedAnswer: record["generated_answer"],
            gptScore: parseFloat(record["gpt_correctness_score"]),
            gptScoreJustification: record["gpt_score_reasoning"],
            score: undefined,
            feedback: undefined
        };
        records.push(feedbackItem);
        i++;
    }

    return records;
}

export const loadGptScoreCsvData = async (version: string) => {
    const csvData = await loadGptScoreDataset(version);
    const records = await loadGptScoreFeedbackCsv(csvData);
    return records;
}

export const loadCsvData = async (version: string) => {
    const csvData = await loadImageDescriptionDataset(version);
    const records = await loadFeedbackCsv(csvData);
    return records;
}
