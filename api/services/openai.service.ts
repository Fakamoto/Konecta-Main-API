import { Configuration, OpenAIApi } from 'openai';

export class OpenaiService {

    configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    openai = new OpenAIApi(this.configuration);

    async completion(prompt: string, mentioned?: string): Promise<{ text: string, tokens: number }> {
        // let finalPrompt = 'The following is a conversation of a Whatsapp chatbot powered by AI called "Konecta" and a User. "Konecta" will reply in any language that the User is talking in. "Konecta" is clever, verbose, and helpful. "Konecta" mainly speaks in spanish and english'
        // if (mentioned) finalPrompt += `\n\nQuote: ${mentioned}`;
        // finalPrompt+= `\n\nUser: ${prompt}`;

        let finalPrompt = prompt;
        if (mentioned) {
            finalPrompt += `: "${mentioned}"`
        }

        finalPrompt += '\n\n'
        finalPrompt += 'Konecta:'

        const completion = await this.openai.createCompletion({
            model: 'text-davinci-003',
            prompt: finalPrompt,
            temperature: 0.5,
            max_tokens: 500,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
            stop: ['Konecta:']
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
