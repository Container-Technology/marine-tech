import { Discord, Slash, SlashOption, SlashChoice } from 'discordx';
import { type CommandInteraction, ApplicationCommandOptionType, InteractionCollector, Interaction } from 'discord.js';
import replicate from '../services/replicate.js';
import { sleep } from '../utils/sleep.js';
import { elipsis, matchLast } from '../utils/format.js';
import path from 'path';

@Discord()
class video {
  @Slash({ description: 'video', name: 'video'})
  async video(
      @SlashOption({
          description: 'Input prompt - describe the scene for AI to generate.',
          name: 'prompt',
          required: true,
          type: ApplicationCommandOptionType.String,
      })
      prompt: string,

      interaction: CommandInteraction
  ) {
    await interaction.deferReply({ ephemeral: false });

    try {
      const source = `💬 Input: \`${elipsis(prompt, 800)}\`\ \n📹 Video: ${'<https://media.discordapp.net/attachments/1018156009413431296/1078469805339856928/video.mp4>'}\n🎭 Mask: ${'<https://media.discordapp.net/attachments/1018156009413431296/1078473887668506684/mask.mp4>'}`;

      const { id } = await replicate.video(prompt);

      let logs: string = '';
      let output: string = '';
      let completed;
      let predictionStatus: string = '';
      let seed: string = '';

      while (!completed?.length)  {
        await sleep(3000);

        ({ completed_at: completed, status: predictionStatus, output, logs } = await replicate.status(id));

        let seedStringMatch = logs.match(/Global seed set to [0-9]*/);
        let seedDigitMatch = seedStringMatch?.length ? seedStringMatch[0].match(/\d+/) : '';
        seed = seedDigitMatch?.length ? seedDigitMatch[0] : '';

        await interaction.editReply({
          content: source + (seed.length ? `\n🧬 Seed: \`${seed}\`\n` : '') + `\n\n**Waiting for prediction:**` + `\n${logs?.length ?
            matchLast(logs, /Rendering animation frame [0-9]* of [0-9]*/g) :
            predictionStatus
            }`,
          files: [
              {
                  attachment: path.join(process.cwd(), 'build', 'assets', 'wait.gif')
              }
          ]
        });  
      }

      if (predictionStatus == 'succeeded') {
        await interaction.editReply({ 
          content: source + '\n\n' + `**Output:**`,
          files: [
            {
              attachment: output
            }
          ]
        });
      } else {
        await interaction.editReply({ 
          content: source + '\n\n' + `Prediction failed:/ (maybe we ran out of credits?).`,
          files: [
          ]
        });
      }
    } catch (err) {
      console.log(err)

      await interaction.editReply({
        content: `⚠️ Unknwon error, please contact sysop.`
    });
    }
  }
}