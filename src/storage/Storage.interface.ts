import { Data } from '../common/model/Data.interface';

export interface StorageService {
    getData(isDevMode?: boolean): Promise<Data>;
    setData(data: Data): Promise<void>;
}
