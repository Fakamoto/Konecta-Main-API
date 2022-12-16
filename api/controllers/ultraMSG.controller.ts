import { Request, Response } from 'express';
import { OK } from 'http-status-codes';
import { UltraMSGData, UltraMSGService } from '../services/ultraMSG.service';
import { KonectaAIApiService } from '../services';

export class UltraMSGController {

    constructor(private ultraMSGService: UltraMSGService, private konectaAIApiService: KonectaAIApiService) {}

    webhook = async (req: Request, res: Response): Promise<void> => {
        const { data }: {data : UltraMSGData} = req.body;
        console.log(data);

        const isFromGroup = this.ultraMSGService.isFromGroup(data);
        const isFromUser = this.ultraMSGService.isFromUser(data);
        const isMentioned = this.ultraMSGService.isMentioned(data);

        // Leave if from group and not mentioned
        if (isFromGroup && !isMentioned) {
            res.status(OK).json({ message: 'From group not mentioned' });
            return;
        }

        // Save if is Audio
        const isAudio = this.ultraMSGService.isAudio(data);
        if (isAudio) {
            this.ultraMSGService.saveAudio(data);
        }
        // Save if is Audio
        const isImage = this.ultraMSGService.isImage(data);
        if (isImage) {
            this.ultraMSGService.saveImage(data);
        }

        // get Reply
        const prompt = this.ultraMSGService.getPrompt(data);
        const reply = await this.getReply(data, { prompt, isFromGroup, isFromUser });

        await this.ultraMSGService.sendMessage(reply, data.from);
        res.status(OK).json({ message: 'Konecta Main API' });
    };

    async getReply(data: UltraMSGData, { prompt, isFromUser }: { isFromGroup: boolean, prompt: string, isFromUser: boolean }): Promise<string> {
        // if reply image
        const replyImage = this.ultraMSGService.getReplyImage(data);
        if (replyImage) {
            return this.konectaAIApiService.generateImageFromImage(replyImage.media, prompt)
        }

        // if audio from User
        const isAudio = this.ultraMSGService.isAudio(data);
        if (isFromUser && isAudio) {
            return this.konectaAIApiService.transcriptAudio(data.media)
        }

        // if reply audio from Group
        const replyAudio = this.ultraMSGService.getReplyAudio(data);
        if (replyAudio) {
            return this.konectaAIApiService.transcriptAudio(replyAudio.media)
        }

        // if start with image
        const isImageGenerator = this.ultraMSGService.isImageGenerator(prompt);
        if (isImageGenerator) {
            return this.konectaAIApiService.generateImageFromText(prompt)
        }

        // else transcribe text
        return this.konectaAIApiService.generateText(prompt);
    }
}
