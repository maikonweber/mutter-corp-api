import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken: string;
  private readonly chatId: string;
  private readonly apiUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.botToken = configService.get<string>('TELEGRAM_TOKEN');
    this.chatId = this.configService.get<string>('TELEGRAM_CHAT_ID');
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  async sendMessageToSpecificChat(
    message: string,
    specificChatId: string,
  ): Promise<void> {
    try {
      const response = await axios.post(`${this.apiUrl}/sendMessage`, {
        chat_id: specificChatId,
        text: message,
      });

      if (response.data.ok !== true) {
        throw new Error(`Failed to send message: ${response.data.description}`);
      }
    } catch (error) {
      // Handle errors appropriately
      console.error(error.message);
      throw error;
    }
  }
}
