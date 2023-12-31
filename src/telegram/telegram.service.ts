import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class TelegramService {
    private readonly logger = new Logger(TelegramService.name)
    private readonly botToken: string;
    private readonly chatId: string;

    constructor(private readonly configService: ConfigService) {
        this.botToken = configService.get<string>('TELEGRAM_TOKEN');
        this.chatId = this.configService.get<string>('TELEGRAM_CHAT_ID');

    }

    async sendMessage(message: string): Promise<void> {
        const apiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

        const params = new URLSearchParams({
            chat_id: this.chatId,
            text: message,
        });

        const url = `${apiUrl}?${params}`;

        try {
            const response = await fetch(url, { method: 'POST' });

            if (!response.ok) {
                throw new Error(`Failed to send message: ${response.statusText}`);
            }
        } catch (error) {
            // Handle errors appropriately
            console.error(error.message);
        }
    }
}