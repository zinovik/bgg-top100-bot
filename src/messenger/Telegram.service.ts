import axios from 'axios';

import { MessengerService } from './MessengerService.interface';
import { ISendMessageResult } from './SendMessageResult.interface';

const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

export class TelegramService implements MessengerService {
  constructor(private readonly token: string) {
    this.token = token;
  }

  async sendMessage({ chatId, text }: { chatId: string | number; text: string }): Promise<void> {
    const chunks = this.stringToChunks(text, 4095);

    for (const chunk of chunks) {
      const message = {
        text: chunk,
        chat_id: chatId,
        disable_notification: true,
        parse_mode: 'Markdown',
      };

      try {
        console.log(`Sending telegram message: ${JSON.stringify(message)}...`);

        const { data }: { data: ISendMessageResult } = await axios.post(
          `${TELEGRAM_API_URL}${this.token}/sendMessage`,
          message,
        );

        console.log(`Telegram message was successfully sent: ${JSON.stringify(data)}`);
      } catch (error) {
        console.log('Error sending Telegram message', error);
      }
    }
  }

  private stringToChunks(str: string, size: number): string[] {
    const chunks: string[] = [];

    let restOfTheStr = str;

    while (restOfTheStr.length > 0) {
      const lastNewLineIndexInChunk = restOfTheStr.substring(0, size).lastIndexOf('\n');

      chunks.push(restOfTheStr.substring(0, lastNewLineIndexInChunk === -1 ? size : lastNewLineIndexInChunk));
      restOfTheStr = restOfTheStr.substring(lastNewLineIndexInChunk === -1 ? size : lastNewLineIndexInChunk + 1);
    }

    return chunks;
  }
}
