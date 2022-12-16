/* eslint-disable */
import Params from '../params';
import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { WebhookMessageParams } from './webhookMessageParams';

export class WebhookDialogflowRequestParams extends Params {

    public getSession(): string {
        const key = '/sessions/';
        const indexOf = this.sessionInfo.session.indexOf(key) + key.length;
        return  this.sessionInfo.session.substring(indexOf, this.sessionInfo.session.length);
    }

    @IsString()
    @Expose()
    detectIntentResponseId!: string;

    @IsString()
    @Expose()
    languageCode!: string;

    @IsObject()
    @Expose()
    fulfillmentInfo!: {
        tag: string;
    };

    @IsObject()
    @Expose()
    intentInfo!: {
        lastMatchedIntent: string;
        displayName: string;
        parameters?: any;
        confidence: number;
    };

    @IsObject()
    @Expose()
    pageInfo!: {
        currentPage: string;
        displayName: string;
        formInfo?: {
            parameterInfo: {
                displayName: string;
                required: boolean;
                state: string;
                value: string;
            }[];
        }
    };

    @IsObject()
    @Expose()
    sessionInfo!: {
        session: string;
        parameters?: any;
    };

    @IsArray()
    @IsOptional()
    @Expose()
    messages?: WebhookMessageParams[];
}
