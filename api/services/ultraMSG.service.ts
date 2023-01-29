import Config from '../config';
import request from 'request';

const getContentTypeOfURl = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        request.head(url, (err, res) => {
            if (err) return reject(err);
            resolve(res.headers['content-type']);
        });
    });
}
export const endsWith = (str: string, suffix: string): boolean => {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

export const removeMultiSpaces = (str: string): string => {
    return str.replace(/\s+/g, ' ');
}

const getStringUntil = (str: string, until: string): string => {
    return str.split(until)[0];
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

    getPhone(data: UltraMSGData): string {
        if (this.isFromGroup(data)) return data.author;

        return data.from;
    }

    getName(data: UltraMSGData): string {
        return data.pushname;
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
    isReplyMedia(data: UltraMSGData): boolean {
        return data.quotedMsg.media;
    }

    async isReplyImage(data: UltraMSGData): Promise<boolean> {
        if (!this.isReplyMedia(data)) return false;

        const contentType = await getContentTypeOfURl(data.quotedMsg.media)
        return contentType.startsWith('image');
    }

    async isReplyAudio(data: UltraMSGData): Promise<boolean> {
        if (!this.isReplyMedia(data)) return false;

        const contentType = await getContentTypeOfURl(data.quotedMsg.media)
        return contentType === 'audio/ogg; codecs=opus';
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

    isQuotingSomething(data: UltraMSGData): boolean {
        return data.quotedMsg.body;
    }

    removeMentions(prompt: string): string {
        return prompt.replace(/\@(.[0-9]*?)( |$|:)/g, '');
    }

    getPrompt(data: UltraMSGData): string {
        let prompt = data.body;

        // Remove mentions from message;
        prompt = this.removeMentions(prompt);

        // Remove multi spaces
        prompt = removeMultiSpaces(prompt)

        // Trim messages
        return prompt.trim();
    }

    getReplyMessage(data: UltraMSGData): string {
        return data.quotedMsg ? data.quotedMsg.body : '';
    }

    sendMessage(prompt: string, to: string, { msgId, mention }: { msgId?: string, mention?: string } = {}) {
        return new Promise((resolve, reject) => {
            const options = {
                method: 'POST',
                url: `https://api.ultramsg.com/${Config.ultraMSG.instance}/messages/chat`,
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                form: {
                    token: Config.ultraMSG.token,
                    to,
                    body: prompt,
                    priority: '5',
                    referenceId: '',
                    msgId,
                    mentions: mention ? [mention] : undefined
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
                url: `https://api.ultramsg.com/${Config.ultraMSG.instance}/messages/image`,
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
