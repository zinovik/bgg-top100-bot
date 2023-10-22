import { createClient, RedisClient } from 'redis';
import { DataBaseService } from './DataBaseService.interface';
import { Data } from '../common/model/Data.interface';

const KEY_NAME = '@bggtop100';

export class RedisService implements DataBaseService {
  private redisPassword: string;
  private client: RedisClient;

  constructor(private redisUrl: string) {
    this.redisUrl = redisUrl;
    this.redisPassword = redisUrl.replace('redis://', '').split('@')[0];

    this.client = createClient(redisUrl, { auth_pass: this.redisPassword });
  }

  async getData(): Promise<Data> {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      this.client.get(KEY_NAME, (err: any, reply: string) => {
        const emptyData = {
          games: [],
          date: '',
        };

        if (err || reply === null) {
          return resolve(emptyData);
        }

        try {
          const data = JSON.parse(reply);
          resolve(data);
        } catch (error) {
          resolve(emptyData);
        }
      });
    });
  }

  async setData(data: Data): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.set(KEY_NAME, JSON.stringify(data), (err: any, reply: string) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }
}
