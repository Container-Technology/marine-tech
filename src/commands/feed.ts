import { Discord, Slash, SlashOption, SlashChoice } from 'discordx';
import { type CommandInteraction, ApplicationCommandOptionType, Embed } from 'discord.js';
import openai from '../services/openai.js';
import { elipsis } from '../utils/format.js';
import { previousDay } from 'date-fns';

@Discord()
class feed {
  @Slash({ description: 'feed', name: 'feed'})
  async feed(
      @SlashOption({
          description: 'The input text to use as a starting point for the edit.',
          name: 'input',
          required: true,
          type: ApplicationCommandOptionType.String,
      })
      input: string,

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
        const source = `Input: \`${elipsis(input)}\`\nInstruction: \`${elipsis(instruction)}\`\nTemperature: \`${temperature || 1.0}\``;

        await interaction.reply(source + `\n\nWaiting for prediction...`);

        const prediction = await openai.predict(input, instruction, temperature);

        await interaction.editReply(source + '\n\n' + 'Output: `' + prediction.choices[0].text + '`');
    }  catch (err) {
        console.error(err);

        await interaction.reply(`⚠️ Error: input text length must be under 4000 tokens`);
    }
  }
}