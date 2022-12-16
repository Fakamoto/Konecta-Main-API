export class KonectaAIApiService {

    async generateText(text: string): Promise<string> {
        console.log(text);
        return ('generateText not implemented.');
    }

    async transcriptAudio(audioUrl: string): Promise<string> {
        console.log(audioUrl);
        return ('transcriptAudio not implemented.');
    }

    // HOLA

    async generateImageFromText(text: string): Promise<string> {
        console.log(text);
        return ('generateImageFromText not implemented.');
    }

    async generateImageFromImage(imageUrl: string, prompt: string): Promise<string> {
        console.log(imageUrl, prompt);
        return ('generateImageFromImage not implemented.');
    }

}
