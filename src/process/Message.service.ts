import { ProcessService } from './ProcessService.interface';
import { Data } from '../common/model/Data.interface';

type Game = { rank: number; name: string; year: string };

export class MessageService implements ProcessService {
  formatMessage({ newData, oldData }: { newData: Data; oldData: Data }): string {
    const date = `On date: ${new Date(newData.date).toLocaleString()}`;
    const date2 = `Changes from date: ${new Date(oldData.date).toLocaleString()}`;

    const newGames: Game[] = [];
    const droppedGames: Game[] = oldData.games.filter((oldGame) =>
      newData.games.every((newGame) => newGame.name !== oldGame.name),
    );

    const gamesList = newData.games.reduce((list, game) => {
      const oldGame = oldData.games.find((old) => old.name === game.name);

      if (!oldGame) {
        newGames.push(game);
      }

      const change = oldGame ? oldGame.rank - game.rank : 0;

      const changeString = change > 0 ? ` ⬆️ ${change}` : change < 0 ? ` ⬇️ ${Math.abs(change)}` : '';

      return `${list}\n${this.formatGame(game, changeString)}`;
    }, '');

    const newGamesString = `🆕 Game(s) new in Top 100:\n${
      newGames.length > 0 ? newGames.map((game) => this.formatGame(game)).join('\n') : 'none'
    }`;

    const droppedGamesString = `❌ Game(s) dropped out of Top 100:\n${
      droppedGames.length > 0 ? droppedGames.map((game) => this.formatGame(game)).join('\n') : 'none'
    }`;

    return `${date}\n${date2}\n${gamesList}\n\n${newGamesString}\n\n${droppedGamesString}`;
  }

  private formatGame(game: { rank: number; name: string; year: string }, changeString = ''): string {
    return `${game.rank}. ${game.name} (${game.year})${changeString}`;
  }
}
