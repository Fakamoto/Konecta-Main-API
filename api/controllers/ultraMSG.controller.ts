import { Request, Response } from 'express';
import { OK } from 'http-status-codes';
import { UltraMSGData, UltraMSGService } from '../services/ultraMSG.service';
import { AccountService, KonectaAIApiService } from '../services';
import { LimitRequestError } from '../helpers/errors/limitRequestError';
import { BASIC_PLAN, ENTERPRISE_PLAN, StripeService } from '../services/stripe.service';

export class UltraMSGController {

    constructor(
        private ultraMSGService: UltraMSGService,
        private konectaAIApiService: KonectaAIApiService,
        private accountService: AccountService,

        private stripeService: StripeService,
    ) { }

    webhook = async (req: Request, res: Response): Promise<void> => {
        const { data, event_type: eventType }: { data: UltraMSGData, event_type: string } = req.body;
        try {
            // console.log(data);

            if (eventType === 'message_create') {
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
            const quotaMessage = this.ultraMSGService.getReplyMessage(data);
            const { data: reply, type } = await this.getReply(data, { prompt, quotaMessage, isFromGroup, isFromUser, isAudio, isImage });

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
            const phone = this.ultraMSGService.getPhone(data);

            let plan = BASIC_PLAN;
            const account = await this.accountService.findByPhone(phone);
            if (account.planName === BASIC_PLAN.name) {
                plan = ENTERPRISE_PLAN;
            }

            if (e instanceof LimitRequestError) {
                // const account = await this.accountService.findByPhone(data.from);
                // if (account) {}
                // const url = await this.stripeService.createStripeLink(phone, plan);
                const name = this.ultraMSGService.getName(data);

                const isFromGroup = this.ultraMSGService.isFromGroup(data);
                if (isFromGroup) {
                    await this.ultraMSGService.sendMessage(
                        `*${name}* You have reached the limit of this *free trial*.`,
                        data.from,
                    );
                }

                await this.ultraMSGService.sendMessage(
                    `*${name}* You have reached the limit of your plan! Check our subscriptions at *Konecta.tech/store*`,
                    phone,
                );

                res.status(OK).json({ message: 'Limit reached' });
                return;
            }

            console.error(e);
            res.status(OK).json({ message: 'Something happened' });
        }
    };

    async getReply(data: UltraMSGData, { prompt, quotaMessage, isFromUser, isAudio, isImage }: { prompt: string, quotaMessage: string, isFromGroup: boolean, isFromUser: boolean, isAudio: boolean, isImage: boolean }): Promise<{ data: string, type: 'image' | 'message' }> {
        const phone = this.ultraMSGService.getPhone(data);
        let account = await this.accountService.findByPhone(phone)

        if (!account) {
            account = await this.accountService.create({ phone })
            this.ultraMSGService.sendMessage(
                `*Hi 😁 I Am Konecta!*\n\n*Check Our Website To Learn The Instructions!: Konecta.tech*`,
                phone,
            );
        };

        // Is a User generating an Image
        if (isFromUser && isImage && prompt) {
            return {
                data: await this.konectaAIApiService.generateImageFromImage(account, data.media, prompt),
                type: 'image',
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
                data: await this.konectaAIApiService.generateText(account, audioTranscription, quotaMessage, true),
                type: 'message',
            }
        }

        // if reply image
        const replyImage = await this.ultraMSGService.isReplyImage(data);
        if (replyImage) {
            return {
                data: await this.konectaAIApiService.generateImageFromImage(account, data.quotedMsg.media, prompt),
                type: 'image',
            }
        }

        // if reply audio from Group
        const replyAudio = await this.ultraMSGService.isReplyAudio(data);
        if (replyAudio) {
            const transcription = await this.konectaAIApiService.transcriptAudio(account, data.quotedMsg.media);
            const isTranscriptionImageGenerator = this.ultraMSGService.isImageGenerator(transcription);
            if (prompt.length > 0) {
                const text = `${prompt}: "${transcription}"`;

                const isImageGenerator = this.ultraMSGService.isImageGenerator(prompt);
                if (isImageGenerator || isTranscriptionImageGenerator) {
                    return {
                        data: await this.konectaAIApiService.generateImageFromText(account, text, true),
                        type: 'image',
                    }
                }

                return {
                    data: await this.konectaAIApiService.generateText(account, text, quotaMessage, true),
                    type: 'message',
                }
            }

            return {
                data: transcription,
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

        // else transcribe text
        return {
            data: await this.konectaAIApiService.generateText(account, prompt, quotaMessage),
            type: 'message',
        };
    }
}
