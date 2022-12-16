export class KonectaAIApiService {

    async generateText(text: string): Promise<string> {
        console.log(text);
        throw new Error('generateText not implemented.');
    }

    async transcriptAudio(audioUrl: string): Promise<string> {
        console.log(audioUrl);
        throw new Error('transcriptAudio not implemented.');
    }

    // HOLA

    async generateImageFromText(text: string): Promise<string> {
        console.log(text);
        throw new Error('generateImageFromText not implemented.');
    }

    async generateImageFromImage(imageUrl: string, prompt: string): Promise<string> {
        console.log(imageUrl, prompt);
        throw new Error('generateImageFromImage not implemented.');
    }

}
