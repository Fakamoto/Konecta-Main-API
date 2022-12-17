import Config from '../config';
import request from 'request';

export const endsWith = (str: string, suffix: string): boolean => {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

export const removeMultiSpaces = (str: string): string => {
    return str.replace(/\s+/g, ' ');
}

const getStringUntil = (str: string, until: string): string => {
    return str.substring(0, str.indexOf(until));
}

export const containsAnyString = (str: string, substrings: string[]): boolean => {
    return substrings.some((substring) => {
        return getStringUntil(str, ':')
            .split(' ')
            .splice(0, 3)
            .some((word) => word.toLowerCase().indexOf(substring) > -1);
    });
}

export type UltraMSGData = {
    id: string;
    from: string;
    to: string;
    author: string;
    pushname: string;
    ack: number;
    type: string;
    body: string;
    media: string;
    fromMe: boolean;
    self: boolean;
    isForwarded: boolean;
    isMentioned: boolean;
    quotedMsg: any;
    mentionedIds: string[];
    time: number;
}

export type SavedReply = { id: string, media: string }

export class UltraMSGService {
    // audios: {[id : string]: string} = {};
    audios: SavedReply[] = [];
    maxAudios: number;

    images: SavedReply[] = [];
    maxImages: number;

    constructor() {
        this.maxAudios = Config.maxAudios;
        this.maxImages = Config.maxImages;
    }

    getUserId(data: UltraMSGData): string {
        if (this.isFromGroup(data)) return data.author;

        return data.from;
    }

    isFromGroup(data: UltraMSGData): boolean {
        return endsWith(data.from, '@g.us');
    }

    isFromUser(data: UltraMSGData): boolean {
        return endsWith(data.from, '@c.us');
    }

    isFromMe(data: UltraMSGData): boolean {
        return data.fromMe;
    }

    isMentioned(data: UltraMSGData): boolean {
        return data.isMentioned;
    }

    isAudio(data: UltraMSGData): boolean {
        return data.type === 'ptt' || data.type === 'audio';
    }

    isImage(data: UltraMSGData): boolean {
        return data.type === 'image';
    }

    // TODO: change this to Redis Chche.
    isReplyImage(data: UltraMSGData): boolean {
        return this.images.some((image) => image.id === data.id);
    }

    isReplyAudio(data: UltraMSGData): boolean {
        return this.audios.some((image) => image.id === data.id);
    }

    isReplyMessage(data: UltraMSGData): boolean {
        console.log(data);
        throw new Error('isReplyMessage: Not implemented');
    }

    isImageGenerator(prompt: string): boolean {
        return containsAnyString(prompt.toLowerCase(), [
            'pic', 'photo', 'image', 'img',
            'imagen', 'foto', 'fotos',
        ]);
    }

    saveAudio(data: UltraMSGData): void {
        this.audios.push({ id: data.id, media: data.media });

        // Clean buffer
        if (this.audios.length > this.maxAudios) {
            this.audios.shift();
        }
    }

    saveImage(data: UltraMSGData): void {
        this.images.push({ id: data.id, media: data.media });

        // Clean buffer
        if (this.images.length > this.maxImages) {
            this.images.shift();
        }
    }

    isQuotingSomething(data: UltraMSGData): boolean {
        return data.quotedMsg.body;
    }

    removeMentions(prompt: string): string {
        return prompt.replace(/\@(.[0-9]*?)( |$|:)/g, '');
    }

    getPrompt(data: UltraMSGData): string {
        let prompt = data.body;

        // Concat if mention something;
        const isQuotingSomething = this.isQuotingSomething(data);
        if (isQuotingSomething) {
            const quotedMsg = this.removeMentions(data.quotedMsg.body);
            prompt += `: ${quotedMsg}`;
        }

        // Remove mentions from message;
        prompt = this.removeMentions(prompt);

        // Remove multi spaces
        prompt = removeMultiSpaces(prompt)

        // Trim messages
        return prompt.trim();
    }

    getReplyImage(data: UltraMSGData): SavedReply | undefined {
        return this.images.find((image) => image.id === data.quotedMsg.id);
    }

    getReplyAudio(data: UltraMSGData): SavedReply | undefined {
        return this.audios.find((image) => image.id === data.quotedMsg.id);
    }

    getReplyMessage(data: UltraMSGData): string {
        return data.quotedMsg ? data.quotedMsg.body : '';
    }

    sendMessage(prompt: string, to: string) {
        return new Promise((resolve, reject) => {
            const options = {
                method: 'POST',
                url: 'https://api.ultramsg.com/instance26462/messages/chat',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                form: {
                    token: Config.ultraMSG.token,
                    to,
                    body: prompt,
                    priority: '10',
                    referenceId: ''
                }
            };

            request(options, (error, response, body) => {
                if (error) return reject(error);
                resolve(body);
            });
        });
    }

    sendImage(urlOrBase64: string, to: string, caption: string = ''): Promise<any> {
        return new Promise((resolve, reject) => {
            const options = {
                method: 'POST',
                url: 'https://api.ultramsg.com/instance26462/messages/image',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                form: {
                    token: Config.ultraMSG.token,
                    to,
                    image: urlOrBase64,
                    caption,
                    referenceId: '',
                    nocache: ''
                }
            };

            request(options, function (error, response, body) {
                if (error) return reject(error);
                resolve(body);
            });
        });
    }
}
