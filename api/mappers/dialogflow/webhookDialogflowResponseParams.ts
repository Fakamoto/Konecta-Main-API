/* eslint-disable */
import Params from '../params';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { WebhookMessageParams } from './webhookMessageParams';
import { Logger } from '../../logger';
import Handlebars from 'handlebars';

const LoggerInstance = new Logger('Express');

export class WebhookDialogflowResponseParams extends Params {

    public addMessage(message: string, messageParams: any = {}, mergeBehavior = 'APPEND'): WebhookDialogflowResponseParams {
        const messageWithParams = Handlebars.compile(message)(messageParams);
        if (!this.fulfillmentResponse?.messages) {
            this.fulfillmentResponse = {
                messages: [new WebhookMessageParams(`API: ${messageWithParams}`)],
                mergeBehavior: 'APPEND'
            };
            return this;
        }

        this.fulfillmentResponse.messages.push(new WebhookMessageParams(`API: ${messageWithParams}`));
        // this.fulfillmentResponse.messages.push(new WebhookMessageParams(message));
        return this;
    }

    @IsObject()
    @Expose()
    fulfillmentResponse!: {
        messages?: WebhookMessageParams[];
        mergeBehavior?: 'MERGE_BEHAVIOR_UNSPECIFIED' | 'REPLACE' | 'APPEND';
    };

    @IsObject()
    @IsOptional()
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
    @IsOptional()
    @Expose()
    sessionInfo?: {
        session: string;
    };

    @IsObject()
    @IsOptional()
    @Expose()
    payload?: any;

    @IsString()
    @IsOptional()
    @Expose()
    targetPage?: string;

    @IsString()
    @IsOptional()
    @Expose()
    targetFlow?: string;
}
