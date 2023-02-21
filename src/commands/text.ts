import { Discord, Slash, SlashOption, SlashChoice } from 'discordx';
import { type CommandInteraction, ApplicationCommandOptionType } from 'discord.js';
import openai from '../services/openai.js';
import { encode, decode } from 'gpt-3-encoder';
import { elipsis } from '../utils/format.js';
import path from 'path';

@Discord()
class text {
  @Slash({ description: 'text', name: 'text'})
  async text(
      @SlashOption({
          description: 'The input text to use as a starting point for the edit.',
          name: 'input',
          required: true,
          type: ApplicationCommandOptionType.Attachment,
      })
      input: any,

      @SlashOption({
          description: 'The instruction that tells the model how to edit the prompt.',
          name: 'instruction',
          required: true,
          type: ApplicationCommandOptionType.String,
      })
      instruction: string,

      @SlashChoice({ name: '0.1', value: 0.1 })
      @SlashChoice({ name: '0.2', value: 0.2 })
      @SlashChoice({ name: '0.3', value: 0.3 })
      @SlashChoice({ name: '0.4', value: 0.4 })
      @SlashChoice({ name: '0.5', value: 0.5 })
      @SlashChoice({ name: '0.6', value: 0.6 })
      @SlashChoice({ name: '0.7', value: 0.7 })
      @SlashChoice({ name: '0.8', value: 0.8 })
      @SlashChoice({ name: '0.9', value: 0.9 })
      @SlashChoice({ name: '1.0', value: 1.0 })
      @SlashChoice({ name: '1.1', value: 1.1 })
      @SlashChoice({ name: '1.2', value: 1.2 })
      @SlashChoice({ name: '1.3', value: 1.3 })
      @SlashChoice({ name: '1.4', value: 1.4 })
      @SlashChoice({ name: '1.5', value: 1.5 })
      @SlashChoice({ name: '1.6', value: 1.6 })
      @SlashChoice({ name: '1.7', value: 1.7 })
      @SlashChoice({ name: '1.8', value: 1.8 })
      @SlashChoice({ name: '1.9', value: 1.9 })
      @SlashChoice({ name: '2.0', value: 2.0 })
      @SlashOption({
          description: 'What sampling temperature to use (higher = random, lower = more deterministic). Defaults to 1.',
          name: 'temperature',
          required: false,
          type: ApplicationCommandOptionType.Number
      })
      temperature: number,

      interaction: CommandInteraction,
  ) {
    try {
        await interaction.deferReply();

        // Max amount of tokens we can process at once
        const chunkLimit = 4000;

        const inputText = await(await fetch(input.attachment)).text();
        const inputTextChunks: string[] = decode(encode(inputText))
            .split(' ')
            .reduce((acc: string[][], token: string, idx: number) => {
                const chunkIdx = Math.floor(idx/chunkLimit);

                if (!acc[chunkIdx]) {
                    acc[chunkIdx] = [];
                }

               acc[chunkIdx].push(token);

               return acc;
            }, []).map((chunk) => chunk.join(' '));

        const outputTextChunks: string[] = [];

        const source = `💬 Input: \`${elipsis(inputText, 800)}\`\ [${input.attachment}]\n🛠️ Instruction: \`${elipsis(instruction, 800)}\`\n🌡️ Temperature: \`${temperature || 1.0}\``;
        await interaction.editReply({
            content: source + `\n\n**Waiting for prediction...**`,
            files: [
                {
                    attachment: path.join(process.cwd(), 'build', 'assets', 'wait.gif')
                }
            ]
        });

        for (const inputTextChunk of inputTextChunks) {
            const { text: prediction } = await openai.predict(inputText, instruction, temperature);

            outputTextChunks.push(prediction);

            console.log(prediction);
        }

        const outputText = outputTextChunks.join(' ');

        console.log(outputText);

        await interaction.editReply({
            content: source + '\n\n' + 'Output:',
            files: [{
                attachment: Buffer.from(outputText, 'utf8'),
                name: 'output.txt'
            }]
        });
    }  catch (err) {
        console.error(err);

        await interaction.reply({
            content: `⚠️ Unknwon error, please contact sysop.`,
            ephemeral: true
        });
    }
  }
}