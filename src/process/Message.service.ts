import { ProcessService } from './ProcessService.interface';
import { Data } from '../common/model/Data.interface';

type Game = { rank: number; name: string; year: string };

export class MessageService implements ProcessService {
  formatMessage({ newData, oldData }: { newData: Data; oldData: Data }): string {
    const date = this.getDateString('On date', newData.date);
    const oldDate = this.getDateString('Changes from date', oldData.date);

    const newGames: Game[] = [];
    const droppedGames: Game[] = oldData.games.filter((oldGame) =>
      newData.games.every((newGame) => newGame.name !== oldGame.name),
    );
    const increaseGames: { games: Game[]; change: number } = { games: [], change: 0 };
    const decreaseGames: { games: Game[]; change: number } = { games: [], change: 0 };
    const gamesByYear: { [year: string]: number } = {};

    const gamesList = newData.games.reduce((list, game) => {
      const oldGame = oldData.games.find((old) => old.name === game.name);

      gamesByYear[game.year] = gamesByYear[game.year] ? gamesByYear[game.year] + 1 : 1;

      if (!oldGame) {
        newGames.push(game);

        return `${list}\n${this.formatGame(game, ' 🆕')}`;
      }

      const change = oldGame.rank - game.rank;

      if (change > 0 && change >= increaseGames.change) {
        if (change > increaseGames.change) {
          increaseGames.change = change;
          increaseGames.games = [];
        }

        increaseGames.games.push(game);
      }

      if (change < 0 && change <= decreaseGames.change) {
        if (change < decreaseGames.change) {
          decreaseGames.change = change;
          decreaseGames.games = [];
        }

        decreaseGames.games.push(game);
      }

      const changeString = change > 0 ? ` ⬆️ +${change}` : change < 0 ? ` ⬇️ ${change}` : '';

      return `${list}\n${this.formatGame(game, changeString)}`;
    }, '');

    const newGamesString = this.getAdditionalList('🆕 Game(s) new in Top 100', newGames);
    const droppedGamesString = this.getAdditionalList('❌ Game(s) dropped out of Top 100', droppedGames);

    const increaseGamesString = this.getAdditionalList(
      `⬆️ Highest ranking increase${increaseGames.change > 0 ? ` (+${increaseGames.change})` : ''}`,
      increaseGames.games,
    );
    const decreaseGamesString = this.getAdditionalList(
      `⬇️ Highest ranking decrease${decreaseGames.change < 0 ? ` (${decreaseGames.change})` : ''}`,
      decreaseGames.games,
    );

    const gamesByYearString = `📅 Games by Release Year:${Object.keys(gamesByYear).map(
      (year) => `\n${year}: ${gamesByYear[year]}`,
    )}`;

    return `${date}\n\n${oldDate}\n${gamesList}\n\n${newGamesString}\n\n${droppedGamesString}\n\n${increaseGamesString}\n\n${decreaseGamesString}\n\n${gamesByYearString}`;
  }

  private getDateString(text: string, date: string): string {
    const options = {
      timeZoneName: 'short',
      hour: 'numeric',
      minute: 'numeric',
    } as const;
    const dateString = new Date(date).toLocaleString('en-US', options);

    return `${text}:\n${date.slice(0, 10)} ${dateString}`;
  }

  private getAdditionalList(text: string, games: Game[]): string {
    const gamesString = games.map((game) => this.formatGame(game)).join('\n');

    return `${text}:\n${gamesString || 'none'}`;
  }

  private formatGame(game: { rank: number; name: string; year: string }, changeString = ''): string {
    return `${game.rank}. ${game.name} (${game.year})${changeString}`;
  }
}
