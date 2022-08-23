import axios from 'axios';
import { DataService } from './DataService.interface';
import { Data } from '../common/model/Data.interface';

const URL = 'https://bgg-games-ranks-zinovik.vercel.app/api/get-games?amount=100&load';

export class BGGGamesRanksService implements DataService {
  async getData(): Promise<Data> {
    const { data } = await axios.get(URL);

    return data;
  }
}
