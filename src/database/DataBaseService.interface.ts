import { Data } from '../common/model/Data.interface';

export interface DataBaseService {
  getData(): Promise<Data>;
  setData(data: Data): Promise<void>;
}
