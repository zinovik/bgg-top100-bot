import * as dotenv from 'dotenv';
import { NowRequest, NowResponse } from '@now/node';

import { ConfigParameterNotDefinedError } from '../src/common/error/ConfigParameterNotDefinedError';
import { Main } from '../src/main/Main';
import { BGGService } from '../src/data/BGG.service';
import { RedisService } from '../src/database/Redis.service';
import { MessageService } from '../src/process/Message.service';
import { TelegramService } from '../src/messenger/Telegram.service';

dotenv.config();

export default async (_req: NowRequest, res: NowResponse): any => {
  const {
    query: { token },
  } = _req;

  console.log('New request');

  if (process.env.TELEGRAM_TOKEN === undefined) {
    throw new ConfigParameterNotDefinedError('TELEGRAM_TOKEN');
  }
  if (process.env.APP_TOKEN === undefined) {
    throw new ConfigParameterNotDefinedError('APP_TOKEN');
  }
  if (process.env.CHANNEL_ID === undefined) {
    throw new ConfigParameterNotDefinedError('CHANNEL_ID');
  }
  if (process.env.REDIS_URL === undefined) {
    throw new ConfigParameterNotDefinedError('REDIS_URL');
  }

  if (token !== process.env.APP_TOKEN) {
    return res.status(401).send(
      JSON.stringify({
        result: 'wrong token',
      }),
    );
  }

  const configuration = {
    channelId: process.env.CHANNEL_ID,
  };

  const main = new Main(
    configuration,
    new BGGService(),
    new RedisService(process.env.REDIS_URL),
    new MessageService(),
    new TelegramService(process.env.TELEGRAM_TOKEN),
  );

  try {
    await main.sendMessage();
  } catch (error) {
    console.error('Unexpected error occurred: ', error.message);
  }

  res.status(200).send(
    JSON.stringify({
      result: 'success',
    }),
  );
};
