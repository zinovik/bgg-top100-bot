import * as functions from '@google-cloud/functions-framework';
import { ConfigParameterNotDefinedError } from './common/error/ConfigParameterNotDefinedError';
import { Main } from './main/Main';
import { BGGGamesRanksService } from './data/BGGGamesRanks.service';
import { GoogleStorageService } from './storage/GoogleStorage.service';
import { MessageService } from './process/Message.service';
import { TelegramService } from './messenger/Telegram.service';

const BUCKET_NAME = 'boardgamegeek';
const FILE_NAME = 'bgg-top100-bot.json';
const PARSER_URL =
    'https://us-central1-zinovik-project.cloudfunctions.net/bgg-games-ranks-parser';
const DEFAULT_CHANNEL = '446618160';

functions.http('main', async (req, res) => {
    console.log('Triggered!');

    if (process.env.TELEGRAM_TOKEN === undefined) {
        throw new ConfigParameterNotDefinedError('TELEGRAM_TOKEN');
    }

    const {
        query: { channelId, isDevMode },
    } = req;

    const configuration = {
        channelId: typeof channelId === 'string' ? channelId : DEFAULT_CHANNEL,
        isDevMode: typeof isDevMode === 'string' ? isDevMode !== 'off' : true,
    };

    const main = new Main(
        configuration,
        new BGGGamesRanksService(PARSER_URL),
        new GoogleStorageService(BUCKET_NAME, FILE_NAME),
        new MessageService(),
        new TelegramService(process.env.TELEGRAM_TOKEN)
    );

    await main.sendMessage();

    console.log('Done!');

    res.status(200).json({
        result: 'success',
    });
});
