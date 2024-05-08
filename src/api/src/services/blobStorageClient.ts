import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import blobStorageConfig from '../config/blobStorageConfig';
import { FeedbackItem } from '../models/feedbackItem';


let containerClient: ContainerClient | undefined;
const initClient = (): ContainerClient => {
    if (containerClient) {
        return containerClient;
    }

    const blobStorageClient = BlobServiceClient.fromConnectionString(blobStorageConfig.connectionString);
    containerClient = blobStorageClient.getContainerClient(blobStorageConfig.containerName);

    return containerClient;
}

export const loadImageDescriptionDataset = async (): Promise<string> => {
    const containerClient = initClient();
    const blobClient = containerClient.getBlobClient(`${blobStorageConfig.datasetVersion}/data/image_descriptions.csv`);
    const downloadBlockBlobResponse = await blobClient.download();
    if (!downloadBlockBlobResponse.readableStreamBody) {
        throw new Error("Failed to download image descriptions dataset");
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
