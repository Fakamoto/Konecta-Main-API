import axios, {AxiosInstance} from 'axios';
import Config from '../config';

export class KonectaAIApiService {

    httpClient: AxiosInstance;

    constructor() {
        this.httpClient = axios.create({
            baseURL: Config.aiAPIUrl,
        })
    }

    async generateText(prompt: string): Promise<string> {
        const { data } = await this.httpClient.post('/api/generate-text', { prompt });
        return data.text;
    }

    async transcriptAudio(url: string): Promise<string> {
        const { data } = await this.httpClient.post('/api/transcribe-audio', { url });
        const { text } = data;
        return text;
    }

    async generateImageFromText(prompt: string): Promise<string> {
        const { data } = await this.httpClient.post('/api/generate-img', { prompt });
        return data.media;
    }

    async generateImageFromImage(imageUrl: string, prompt: string): Promise<string> {
        console.log(imageUrl, prompt);
        return ('Generate image from image not implemented yet.');
    }

}
