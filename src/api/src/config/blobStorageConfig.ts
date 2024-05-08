import dotenv from "dotenv";
import { DOT_ENV_PATH } from "../constants";

dotenv.config({ path: DOT_ENV_PATH });

class BlobStorageConfig {
    connectionString: string;
    containerName: string;
    datasetVersion: string;

    constructor() {
        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
        const datasetVersion = process.env.DATASET_VERSION;

        if (!connectionString || !containerName || !datasetVersion) {
            throw new Error("Missing required configuration");
        }

        this.connectionString = connectionString;
        this.containerName = containerName;
        this.datasetVersion = datasetVersion;
    }
}

export default new BlobStorageConfig();
