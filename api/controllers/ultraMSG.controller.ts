import { Request, Response } from 'express';
import { OK } from 'http-status-codes';
import { UltraMSGData, UltraMSGService } from '../services/ultraMSG.service';
import { KonectaAIApiService } from '../services';

export class UltraMSGController {

    constructor(private ultraMSGService: UltraMSGService, private konectaAIApiService: KonectaAIApiService) {}

    webhook = async (req: Request, res: Response): Promise<void> => {
        const { data, event_type: eventType }: {data : UltraMSGData, event_type: string } = req.body;
        console.log(data);

        if(eventType === 'message_create') {
            if (data.type === 'image') this.ultraMSGService.saveImage(data);
            if (data.type === 'ott') this.ultraMSGService.saveAudio(data);
            res.status(OK).send();
            return;
        }

        const isFromGroup = this.ultraMSGService.isFromGroup(data);
        const isFromUser = this.ultraMSGService.isFromUser(data);
        const isMentioned = this.ultraMSGService.isMentioned(data);

        // Debugger
        if (data.from !== '5492364552179@c.us' && data.from !== '120363027952423923@g.us') {
            res.status(OK).send();
            return;
        }

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

        // if (isFromUser && isImage) {
        //     res.status(OK).json({ message: 'From User Image' });
        //     return;
        // }

        // get Reply
        const prompt = this.ultraMSGService.getPrompt(data);
        const { data: reply, type } = await this.getReply(data, { prompt, isFromGroup, isFromUser, isAudio, isImage });

        const formattedReply = reply
            .replace('conecta', 'Konecta')
            .replace('Conecta', 'Konecta');

        if (type === 'image') {
            await this.ultraMSGService.sendImage(formattedReply, data.from);
        }

        if (type === 'message') {
            await this.ultraMSGService.sendMessage(formattedReply, data.from);
        }

        res.status(OK).json({ message: 'Konecta Main API' });
    };

    async getReply(data: UltraMSGData, { prompt, isFromGroup, isFromUser, isAudio, isImage }: { prompt: string, isFromGroup: boolean, isFromUser: boolean, isAudio: boolean, isImage: boolean }): Promise<{ data: string, type: 'image' | 'message' }> {
        // if reply image
        const replyImage = this.ultraMSGService.getReplyImage(data);
        if (replyImage) {
            return {
                data: await this.konectaAIApiService.generateImageFromImage(replyImage.media, prompt),
                type: 'message', // TODO: change to image
            }
        }

        // Is a User generating an Image
        if (isFromUser && isImage) {
            return {
                data: await this.konectaAIApiService.generateImageFromImage(data.media, prompt),
                type: 'message', // TODO: change to image
            }
        }

        // if audio from User
        if (isFromUser && isAudio) {
            const audioTranscription = await this.konectaAIApiService.transcriptAudio(data.media);
            // Forwarded
            if (data.type === 'audio') {
                return {
                    data: audioTranscription,
                    type: 'message',
                }
            }

            return {
                data: await this.konectaAIApiService.generateText(audioTranscription),
                type: 'message',
            }
        }

        // if reply audio from Group
        const replyAudio = this.ultraMSGService.getReplyAudio(data);
        if (isFromGroup && replyAudio) {
            return {
                data: await this.konectaAIApiService.transcriptAudio(replyAudio.media),
                type: 'message',
            }
        }
        if (isFromUser && replyAudio) {
            return {
                data: await this.konectaAIApiService.transcriptAudio(replyAudio.media),
                type: 'message',
            }
        }

        // if start with image
        const isImageGenerator = this.ultraMSGService.isImageGenerator(prompt);
        if (isImageGenerator) {
            return {
                data: await this.konectaAIApiService.generateImageFromText(prompt),
                type: 'image',
            }
        }

        // else transcribe text
        return {
            data: await this.konectaAIApiService.generateText(prompt),
            type: 'message',
        };
    }
}
