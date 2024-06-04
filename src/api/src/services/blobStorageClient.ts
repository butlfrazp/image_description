import { BlobClient, BlobServiceClient, BlobDownloadResponseParsed, ContainerClient, RestError } from '@azure/storage-blob';
import blobStorageConfig from '../config/blobStorageConfig';
import { FeedbackItem } from '../models/feedbackItem';
import { NotFoundError } from "../models/notFoundError";
import { GptScoreFeedbackItem } from '../models/GptScoreFeedbackItem';


let containerClient: ContainerClient | undefined;
const initClient = (): ContainerClient => {
    if (containerClient) {
        return containerClient;
    }

    const blobStorageClient = BlobServiceClient.fromConnectionString(blobStorageConfig.connectionString);
    containerClient = blobStorageClient.getContainerClient(blobStorageConfig.containerName);

    return containerClient;
}

export const loadImageDescriptionDataset = async (version: string): Promise<string> => {
    const containerClient = initClient();

    let downloadBlockBlobResponse: BlobDownloadResponseParsed;
    try {
        const blobClient = containerClient.getBlobClient(`${version}/data/image_descriptions.csv`);
        downloadBlockBlobResponse = await blobClient.download();
    } catch (err) {
        if (err instanceof RestError && err.statusCode === 404) {
            throw new NotFoundError("Dataset not found.");
        }

        throw err;
    }

    if (!downloadBlockBlobResponse.readableStreamBody) {
        throw new Error("Failed to download image descriptions dataset");
    }

    const buffer = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
    return buffer.toString();
}

export const loadGptScoreDataset = async (version: string): Promise<string> => {
    const containerClient = initClient();

    let downloadBlockBlobResponse: BlobDownloadResponseParsed;
    try {
        const blobClient = containerClient.getBlobClient(`gpt-score/${version}/result.csv`);
        downloadBlockBlobResponse = await blobClient.download();
    } catch (err) {
        if (err instanceof RestError && err.statusCode === 404) {
            throw new NotFoundError("Dataset not found.");
        }

        throw err;
    }

    if (!downloadBlockBlobResponse.readableStreamBody) {
        throw new Error("Failed to download GPT scores dataset");
    }

    const buffer = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
    return buffer.toString();
}

const streamToBuffer = async (readableStream: NodeJS.ReadableStream): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        readableStream.on('data', (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        readableStream.on('error', reject);
    });
}

export const uploadFeedback = async (session: string, feedbackItem: FeedbackItem) => {
    const containerClient = initClient();
    const blobClient = containerClient.getBlockBlobClient(`${blobStorageConfig.datasetVersion}/feedback/${feedbackItem.id}/${session}.json`);

    const payload = JSON.stringify(feedbackItem);
    const uploadBlockBlobResponse = await blobClient.upload(payload, payload.length);
    return uploadBlockBlobResponse;
}

export const uploadGptScoreFeedback = async (session: string, version: string, feedbackItem: GptScoreFeedbackItem) => {
    const containerClient = initClient();
    const blobClient = containerClient.getBlockBlobClient(`gpt-score/${version}/feedback/${feedbackItem.id}/${session}.json`);

    const payload = JSON.stringify(feedbackItem);
    const uploadBlockBlobResponse = await blobClient.upload(payload, payload.length);
    return uploadBlockBlobResponse;
}
