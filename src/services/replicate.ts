import replicateApi from 'replicate';
import { env } from 'process';
import { setDefaultResultOrder } from 'dns';

export default new class replicate {
    api: any;

    constructor () {
        // Curry
        this.api = {};
        this.api.predict = async (data: any) => await replicateApi
            .version('652b0fed80b8c0845b20de06f877115f56b70b2136d02db95f163eff4b95e35d')
            .createPrediction(data);
        this.api.status = async (id: string) => await replicateApi
            .prediction(id)
            .load();
    }

    async video (prompt: string): Promise<any> {
        try {
            const res = await this.api.predict({
                fov: 40,
                fps: 25,
                max_frames: 5,
                neear_plane: 700,
                far_plane: 1200,
                animation_mode: 'Video Input',
                guidance_scale: 10,
                use_mask_video: true,
                video_init_path: 'https://media.discordapp.net/attachments/1018156009413431296/1078469805339856928/video.mp4',
                video_mask_path: 'https://media.discordapp.net/attachments/1018156009413431296/1078473887668506684/mask.mp4',
                animation_prompts: prompt,
                diffusion_cadence: '8',
                extract_nth_frame: 1,
                interpolate_key_frames: true,
                overwrite_extracted_frames: true,
                model_checkpoint: 'Protogen_V2.2.ckpt',
                color_coherence: 'Video Input',
                strength_schedule: '0: (0.8)',
                midas_weight: '0.5'
            });

            console.log(res.id)

            return { id: res.id };
        } catch (err) {
            console.error(err);

            throw Error('Uknown error running prediction.')
        }
    }

    async status (id: string) {
        const res = await this.api.status(id);

        //console.log(res);

        return res;
    }
}