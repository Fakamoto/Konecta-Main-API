import { Configuration, OpenAIApi } from 'openai';

export class OpenaiService {

    configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    openai = new OpenAIApi(this.configuration);

    async completion(prompt: string): Promise<{ text: string, tokens: number }> {
        const completion = await this.openai.createCompletion({
            model: 'text-davinci-002',
            prompt: `The following is a conversation with an Whatsapp chatbot powered by AI called "Konecta", it will reply in any language that the human is talking in. The assistant is helpful, creative, clever, and very friendly. Konecta will reply in spanish if the Human is talking in spanish\n\nHuman: ${prompt}.\nAI:`,
            temperature: 0.5,
            max_tokens: 500,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
            stop:[' Human:', ' AI:']
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
