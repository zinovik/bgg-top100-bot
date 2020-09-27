import { Data } from '../common/model/Data.interface';

export interface DataService {
  getData(): Promise<Data>;
}
