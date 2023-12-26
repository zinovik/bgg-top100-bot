import { Data } from '../common/model/Data.interface';

export interface StorageService {
    getData(): Promise<Data>;
    setData(data: Data): Promise<void>;
}
