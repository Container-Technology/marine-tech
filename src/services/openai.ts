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

    async predict (input: string, instruction: string, model = 'text-davinci-edit-001'): Promise<any> {
        try {
            const { data } = await this.api.createEdit({
                model,
                input,
                instruction
            });

            return data;
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