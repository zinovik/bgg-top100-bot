import { Data } from '../common/model/Data.interface';

export interface ProcessService {
  formatMessage({ newData, oldData }: { newData: Data; oldData: Data }): string;
}
