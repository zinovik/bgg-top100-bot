import { Bucket, Storage, File } from '@google-cloud/storage';
import { StorageService } from './Storage.interface';
import { Data } from '../common/model/Data.interface';

export class GoogleStorageService implements StorageService {
    private readonly bucket: Bucket;

    constructor(
        private readonly bucketName: string,
        private readonly fileName: string
    ) {
        const storage: Storage = new Storage();
        this.bucket = storage.bucket(this.bucketName);
    }

    async getData(isDevMode?: boolean): Promise<Data> {
        try {
            const file = await this.bucket.file(this.fileName).download();

            return JSON.parse(file.toString());
        } catch (_error) {
            console.warn('Can not read data from Google Storage');

            const emptyData: Data = {
                games: [],
                date: new Date().toISOString(),
            };

            if (isDevMode) {
                await this.setData(emptyData);
            }

            return emptyData;
        }
    }

    async setData(data: Data): Promise<void> {
        const file: File = this.bucket.file(this.fileName);
        const dataBuffer = Buffer.from(JSON.stringify(data));
        await file.save(dataBuffer, {
            gzip: true,
            resumable: true,
            metadata: {
                contentType: 'application/json',
            },
        });
    }
}
