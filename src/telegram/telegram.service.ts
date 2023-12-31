import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
    private readonly logge = new Logger(TelegramService.name)
    private readonly key: string;
    constructor(private readonly configService: ConfigService) {
        this.key = configService.get<string>('TELEGRAM_TOKEN');
    }

}
