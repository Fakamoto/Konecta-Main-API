import { Request, Response } from 'express';
import { OK } from 'http-status-codes';
import { UltraMSGData, UltraMSGService } from '../services/ultraMSG.service';
import { AccountService, KonectaAIApiService } from '../services';
import { LimitRequestError } from '../helpers/errors/limitRequestError';

export class UltraMSGController {

    constructor(
        private ultraMSGService: UltraMSGService,
        private konectaAIApiService: KonectaAIApiService,
        private accountService: AccountService,
    ) {}

    webhook = async (req: Request, res: Response): Promise<void> => {
        const { data, event_type: eventType }: { data : UltraMSGData, event_type: string } = req.body;
        try {
            console.log(data);

            if(eventType === 'message_create') {
                res.status(OK).send();
                return;
            }

            const isFromGroup = this.ultraMSGService.isFromGroup(data);
            const isFromUser = this.ultraMSGService.isFromUser(data);
            const isMentioned = this.ultraMSGService.isMentioned(data);

            // Debugger
            // const phone = this.ultraMSGService.getPhone(data);
            // if (!['5492364552179@c.us', '34722847252@c.us', '5491122592094@c.us', '5491123500639@c.us'].includes(phone)) {
            //     res.status(OK).send();
            //     return;
            // }

            // Leave if from group and not mentioned
            if (isFromGroup && !isMentioned) {
                res.status(OK).json({ message: 'From group not mentioned' });
                return;
            }

            const isAudio = this.ultraMSGService.isAudio(data);
            const isImage = this.ultraMSGService.isImage(data);

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
        } catch (e) {
            if (e instanceof LimitRequestError) {
                const name = this.ultraMSGService.getName(data);
                await this.ultraMSGService.sendMessage(`*${name}* you have reached the limit of *${e.message}*`, data.from);

                res.status(OK).json({ message: 'Limit reached' });
                return;
            }
        }
    };

    async getReply(data: UltraMSGData, { prompt, isFromGroup, isFromUser, isAudio, isImage }: { prompt: string, isFromGroup: boolean, isFromUser: boolean, isAudio: boolean, isImage: boolean }): Promise<{ data: string, type: 'image' | 'message' }> {
        const phone = this.ultraMSGService.getPhone(data);
        let account = await this.accountService.findByPhone(phone)
        if (!account) account = await this.accountService.create({ phone });

        // Is a User generating an Image
        if (isFromUser && isImage) {
            return {
                data: await this.konectaAIApiService.generateImageFromImage(account, data.media, prompt),
                type: 'message', // TODO: change to image
            }
        }

        // if audio from User
        if (isFromUser && isAudio) {
            const audioTranscription = await this.konectaAIApiService.transcriptAudio(account, data.media);
            // Forwarded
            if (data.type === 'audio') {
                return {
                    data: audioTranscription,
                    type: 'message',
                }
            }

            return {
                data: await this.konectaAIApiService.generateText(account, audioTranscription, true),
                type: 'message',
            }
        }

        // if start with image
        const isImageGenerator = this.ultraMSGService.isImageGenerator(prompt);
        if (isImageGenerator) {
            return {
                data: await this.konectaAIApiService.generateImageFromText(account, prompt),
                type: 'image',
            }
        }

        // if reply image
        const replyImage = await this.ultraMSGService.isReplyImage(data);
        if (replyImage) {
            return {
                data: await this.konectaAIApiService.generateImageFromImage(account, data.quotedMsg.media, prompt),
                type: 'message', // TODO: change to image
            }
        }

        // if reply audio from Group
        const replyAudio = await  this.ultraMSGService.isReplyAudio(data);
        if (replyAudio) {
            if (isFromGroup) {
                return {
                    data: await this.konectaAIApiService.transcriptAudio(account, data.quotedMsg.media),
                    type: 'message',
                }
            }
            if (isFromUser) {
                return {
                    data: await this.konectaAIApiService.transcriptAudio(account, data.quotedMsg.media),
                    type: 'message',
                }
            }
        }

        // else transcribe text
        return {
            data: await this.konectaAIApiService.generateText(account, prompt),
            type: 'message',
        };
    }
}
