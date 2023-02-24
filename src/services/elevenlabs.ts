import replicate from 'replicate';
import { env } from 'process';

export default new class openai {
    api: any;

    constructor() {
        this.api = async (data) => ({
            speak: await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${data.voice}`, {
                method: 'POST',
                body: JSON.stringify(data.text)
            })
        })
    }

    async video (prompt: string): Promise<any> {
        try {
            const { data } = await this.api.speak({ 
                text: prompt,
                model: '21m00Tcm4TlvDq8ikWAM'
            });

            console.log(data);

            //return data;
        } catch (err) {
            console.error(err);

            throw Error('Uknown error running prediction.')
        }
    }
}