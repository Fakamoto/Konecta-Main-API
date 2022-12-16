import Params from '../params';
import { IsObject, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class WebhookParams extends Params {
    @IsObject()
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
            }
            wa_id: string;
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
            type: 'text' | 'audio' | 'document' | 'image' |
                'video' | 'location' | 'vcard' | 'sticker' |
                'template' | 'interactive';
        }[];
    }

    @IsString()
    @Expose()
    field!: string;
}
