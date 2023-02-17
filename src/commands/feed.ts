import { Discord, Slash, SlashOption } from 'discordx';
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

      interaction: CommandInteraction,
  ) {
    try {
        const source = `Input: \`${elipsis(input)}\`\nInstruction: \`${elipsis(instruction)}\``;

        await interaction.reply(source + `\n\nWaiting for prediction...`);

        const prediction = await openai.predict(input, instruction);

        await interaction.editReply(source + '\n\n' + 'Output: `' + prediction.choices[0].text + '`');
    }  catch (err) {
        console.error(err);

        await interaction.reply(`⚠️ Error: input text length must be under 4000 tokens`);
    }
  }
}