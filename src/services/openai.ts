import { Configuration, OpenAIApi } from 'openai';
import { env } from 'process';

export default new class openai {
    api: OpenAIApi;

    constructor () {
        const config = new Configuration({
            organization: env.OPENAI_ORGANIZATION,
            apiKey: env.OPENAI_TOKEN
        });

        this.api = new OpenAIApi(config);
    }

    async complete (prompt: string, temperature = 1, model = 'text-davinci-003'): Promise<any> {
        try {
            const { data } = await this.api.createCompletion({
                model,
                temperature,
                prompt,
                max_tokens: 2048
            });

            console.log(data);

            return data.choices[0];
        } catch (err) {
            console.error(err);

            throw Error('Uknown error running prediction.')
        }
    }

    async edit (input: string, instruction: string, temperature = 1, model = 'text-davinci-edit-001'): Promise<any> {
        try {
            const { data } = await this.api.createEdit({
                model,
                temperature,
                input,
                instruction
            });

            return data.choices[0];
        } catch (err) {
            console.error(err);

            throw Error('Uknown error running prediction.')
        }
    }

    train (input: string) {
        if (input.length > 4000) {
            throw Error('Text over limit (4000 tokens).');
        }
    }
}