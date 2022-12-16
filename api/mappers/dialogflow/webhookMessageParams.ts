import { IsObject } from 'class-validator';
import { Expose } from 'class-transformer';
import Params from '../params';



export class WebhookMessageParams extends Params {
    constructor(message: string) {
        super();
        this.text = {
            text: [message]
        };
    }

    @IsObject()
    @Expose()
    text: {
        text: string[]
        allowPlaybackInterruption?: boolean;
    }

    //
    // @IsObject()
    // @IsOptional()
    // @Expose()
    // payload?: any;
    //
    // @IsOptional()
    // @IsObject()
    // @Expose()
    // conversationSuccess?: {
    //     metadata: any;
    // }
    //
    // @IsObject()
    // @IsOptional()
    // @Expose()
    // endInteraction?: {
    //     metadata: any;
    // }
}
