import axios from 'axios';
import { DataService } from './DataService.interface';
import { DOMParser } from 'xmldom';
import { select } from 'xpath';
import { Data } from '../common/model/Data.interface';

const URL = 'https://boardgamegeek.com/browse/boardgame/page/1';
const GAME_RANKS_X_PATH = `//td[@class='collection_rank']`;
const GAME_NAMES_YEARS_X_PATH = `//div[starts-with(@id,'results_objectname')]`;

export class BGGService implements DataService {
  async getData(): Promise<Data> {
    const { data: page } = await axios.get(URL);

    const games = this.parsePage(page);

    return {
      games,
      date: new Date().toISOString(),
    };
  }

  private parsePage = (page: string): Array<{ rank: number; name: string; year: string }> => {
    const dom = new DOMParser({
      errorHandler: {
        warning: () => null,
        error: () => null,
        fatalError: () => null,
      },
    }).parseFromString(page);

    const ranks = select(GAME_RANKS_X_PATH, dom).map((selectedValue) => selectedValue.textContent.trim());
    const namesYears = select(GAME_NAMES_YEARS_X_PATH, dom).map((selectedValue) => selectedValue.textContent.trim());

    const names: string[] = [];
    const years: string[] = [];

    namesYears.forEach((nameYear) => {
      const endOfNameIndex = nameYear.indexOf('\n');
      const startOfYearIndex = nameYear.indexOf('\t(');

      if (endOfNameIndex === -1 || startOfYearIndex === -1) {
        names.push(nameYear);
        years.push('');

        return;
      }

      const name = nameYear.substring(0, endOfNameIndex);
      const year = nameYear
        .substring(startOfYearIndex + 1)
        .replace('(', '')
        .replace(')', '');

      names.push(name);
      years.push(year);
    });

    return ranks.map((rank, i) => ({
      rank: Number(rank),
      name: names[i],
      year: years[i],
    }));
  };
}
