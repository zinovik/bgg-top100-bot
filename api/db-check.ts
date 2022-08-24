import * as dotenv from 'dotenv';
import { NowRequest, NowResponse } from '@now/node';

import { ConfigParameterNotDefinedError } from '../src/common/error/ConfigParameterNotDefinedError';
import { RedisService } from '../src/database/Redis.service';

dotenv.config();

export default async (_req: NowRequest, res: NowResponse): Promise<void> => {
  console.log('New DB check request');

  if (process.env.REDIS_URL === undefined) {
    throw new ConfigParameterNotDefinedError('REDIS_URL');
  }

  const databaseService = new RedisService(process.env.REDIS_URL);

  try {
    const data = await databaseService.getData();

    res.status(200).json(data);
  } catch (error) {
    console.error('Unexpected error occurred: ', error.message);
  }
};
