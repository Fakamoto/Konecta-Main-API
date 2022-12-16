/* eslint-disable */
import Params from '../params';
import {IsArray, IsString} from 'class-validator';
import {Expose} from 'class-transformer';

export class WhatsappMessageParams extends Params {
    @IsArray()
    @Expose()
    value!: {
        messaging_product: string;
        metadata: {
            display_phone_number: string;
            phone_number_id: string;
        };
        contacts: {
            profile: {
                name: string;
                wa_id: string;
            }
        }[];
        statuses?: {
            id: string;
            status: string;
            timestamp: string;
            recipient_id: string;
            conversation: {
                id: string;
                origin: {
                    type: string;
                };
            };
            pricing: {
                billable: boolean;
                pricing_model: string;
                category: string;
            };
        }[];
        messages?: {
            from: string;
            id: string;
            timestamp: string;
            text: {
                body: string;
            },
            audio: {
                mime_type: string,
                sha256: string,
                id: string,
                voice: boolean
            },
            type: 'text' | 'audio' | 'document' | 'image' |
                'video' | 'location' | 'vcard' | 'sticker' |
                'template' | 'interactive';
        }[];
    }

    @IsString()
    @Expose()
    field!: string;
}

export class WebhookWhatsappNotificationParams extends Params {

    getPhoneNumberId(): string {
        return this.entry[0].changes[0].value.metadata.phone_number_id;
    };

    getMessage(): { type: 'audio' | 'text', data: any } {
        const messages = this.entry[0].changes[0].value?.messages;
        if (!messages) {
            return {type: 'text', data: ''};
        }

        if (messages[0].type === 'audio') {
            return {
                type: 'audio',
                data: {
                    id: messages[0].id,
                    mimeType: messages[0].audio.mime_type,
                    sha256: messages[0].audio.sha256,
                    voice: messages[0].audio.voice,
                }
            };
        }

        return {type: 'text', data: messages[0].text.body};
    };

    getFrom(): string {
        const messages = this.entry[0].changes[0].value?.messages;
        if (!messages) {
            return '';
        }

        return messages[0].from;
    };

    @IsString()
    @Expose()
    object!: string;

    @IsArray()
    @Expose()
    entry!: {
        id: string;
        changes: WhatsappMessageParams[];
    }[];
}
