import { Stream } from 'stream';
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

    private streamToString(stream: Stream): Promise<string> {
        const chunks: Uint8Array[] = [];
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk: string) =>
                chunks.push(Buffer.from(chunk))
            );
            stream.on('error', (error: Error) => reject(error));
            stream.on('end', () =>
                resolve(Buffer.concat(chunks).toString('utf8'))
            );
        });
    }

    async getData(): Promise<Data> {
        const file: File = this.bucket.file(this.fileName);

        const data = await this.streamToString(file.createReadStream());

        return JSON.parse(data);
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
