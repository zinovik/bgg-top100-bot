import axios from 'axios';

import { MessengerService } from './MessengerService.interface';
import { ISendMessageResult } from './SendMessageResult.interface';

const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

export class TelegramService implements MessengerService {
  constructor(private readonly token: string) {
    this.token = token;
  }

  async sendMessage({ chatId, text }: { chatId: string | number; text: string }): Promise<void> {
    const message = {
      text,
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
