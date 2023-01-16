import { Configuration, OpenAIApi } from 'openai';

export class OpenaiService {

    configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    openai = new OpenAIApi(this.configuration);

    async completion(prompt: string): Promise<{ text: string, tokens: number }> {
        const completion = await this.openai.createCompletion({
            model: 'text-davinci-003',
            prompt: "hola mi nobre es pepe",
            temperature: 0.5,
            max_tokens: 500,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        console.log(completion.data.choices[0].text);
        if (!completion.data.usage) {
            return {
                text: completion.data.choices[0].text || '',
                tokens: 0,
            }
        }

        return {
            text: completion.data.choices[0].text || '',
            tokens: completion.data.usage.total_tokens,
        }
    }
}
