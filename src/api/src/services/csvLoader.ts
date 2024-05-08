import { parse } from "csv-parse";

import { FeedbackItem, Rating } from "../models/feedbackItem";
import { loadImageDescriptionDataset } from "./blobStorageClient";


let _csvFeedbackItems: FeedbackItem[] | undefined = undefined;
const loadCsv = async (csvData: string): Promise<FeedbackItem[]> => {
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


export const loadCsvData = async () => {
    const csvData = await loadImageDescriptionDataset();
    const records = await loadCsv(csvData);
    return records;
}
