import axios from 'axios';
import { DataService } from './DataService.interface';
import { Data } from '../common/model/Data.interface';

const URL = 'https://us-central1-zinovik-project.cloudfunctions.net/bgg-games-ranks-parser?amount=100';

export class BGGGamesRanksService implements DataService {
  async getData(): Promise<Data> {
    const { data } = await axios.get(URL);

    return data;
  }
}
