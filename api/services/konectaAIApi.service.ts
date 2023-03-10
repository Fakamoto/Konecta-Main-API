import axios, { AxiosInstance } from 'axios';
import Config from '../config';
import { Account } from '../models/account/account';
import { AccountService } from './account.service';
import { LimitRequestError } from '../helpers/errors/limitRequestError';
import { OpenaiService } from './openai.service';

export class KonectaAIApiService {

    httpClient: AxiosInstance;

    constructor(
        private accountService: AccountService,
        private openaiService: OpenaiService
    ) {
        this.httpClient = axios.create({
            baseURL: Config.aiAPIUrl,
        })
    }

    async generateText(account: Account, prompt: string, quoteMessage?: string, skipLimit = false): Promise<string> {
        if (!skipLimit) {
            const hasLimit = await this.accountService.hasLimit(account.id, account.phone, account.purchaseDate, account.textGeneratorLimit, 'textGenerator');
            if (!hasLimit) throw new LimitRequestError(`${account.textGeneratorLimit} text generated`);
        }

        const serializedPrompt = prompt;
        // const hasSymbolInLastChar = prompt[prompt.length - 1].match(/[a-zA-Z0-9]/);
        // const serializedPrompt = hasSymbolInLastChar ? `${prompt}.` : prompt;

        const { text, tokens } = await this.openaiService.completion(serializedPrompt, quoteMessage);
        await this.accountService.addTextGeneratorRequest(account, { tokens: tokens });

        return text;
    }

    async transcriptAudio(account: Account, url: string): Promise<string> {
        const hasLimit = await this.accountService.hasLimit(account.id, account.phone, account.purchaseDate, account.audioTranscriptionLimit, 'audioTranscription');
        if (!hasLimit) throw new LimitRequestError(`${account.audioTranscriptionLimit} audios transcribed`);

        const { data } = await this.httpClient.post('/api/transcribe-audio', { url });
        const { text } = data;

        await this.accountService.addAudioTranscriptionRequest(account, { tokens: 0 });
        return text;
    }

    async generateImageFromText(account: Account, prompt: string, skipLimit = false): Promise<string> {
        if (!skipLimit) {
            const hasLimit = await this.accountService.hasLimit(account.id, account.phone, account.purchaseDate, account.imageGeneratorLimit, 'imageGenerator');
            if (!hasLimit) throw new LimitRequestError(`${account.imageGeneratorLimit} images generated`);
        }

        const { data } = await this.httpClient.post('/api/generate-img', { prompt });

        await this.accountService.addImageGeneratorLimitRequest(account, { tokens: 0 });
        return data.base64;
    }

    async generateImageFromImage(account: Account, imageUrl: string, prompt: string): Promise<string> {
        const hasLimit = await this.accountService.hasLimit(account.id, account.phone, account.purchaseDate, account.imageGeneratorLimit, 'imageGenerator');
        if (!hasLimit) throw new LimitRequestError(`${account.imageGeneratorLimit} images generated`);

        console.log(imageUrl, prompt);

        const { data } = await this.httpClient.post('/api/generate-img2img', { prompt, imageUrl });

        await this.accountService.addImageGeneratorLimitRequest(account, { tokens: 0 });
        return data.base64;
    }

}
