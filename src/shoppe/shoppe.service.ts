import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios'; // Import Axios library
import { RedisService } from 'src/redis/redis';

@Injectable()
export class ShoppeService {
    private readonly logger = new Logger(ShoppeService.name)
    private readonly key: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
    ) {
        this.key = configService.get<string>('TELEGRAM_TOKEN');
    }

    async fetchDataAndSaveToRedis(keyword: string): Promise<void> {
        const appid = this.configService.get<string>('AppID');
        const senha = this.configService.get<string>('Senha');
        const endpoint = this.configService.get<string>('ShopeeEndpoint');

        const timestamp = Math.floor(Date.now() / 1000);

        const requestBody = {
            query: `{ productOfferV2(keyword : "${keyword}") { nodes { itemId commissionRate imageUrl productName price productLink } }}`,
        };

        const signature = appid + timestamp + JSON.stringify(requestBody) + senha;
        const hash = crypto.createHash('sha256').update(signature).digest('hex');

        const headers = {
            'content-type': 'application/json',
            Authorization: `SHA256 Credential=${appid}, Timestamp=${timestamp}, Signature=${hash}`,
        };

        try {
            const response = await axios.post(endpoint, requestBody, { headers });

            const productArray = response.data.productOfferV2.nodes;

            await this.redisService.set('ShopeeProduct', productArray);
        } catch (error) {
            // Handle errors appropriately
            console.error(error.message);
        }
    }
}
