/* eslint-disable */
import Params from '../params';
import { IsArray, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class ResponseWhatsappMessageParams extends Params {
    @IsString()
    @Expose()
    messaging_product!: string;

    @IsArray()
    @Expose()
    contacts!: {
        input: string;
        wa_id: string;
    }[];

    @IsArray()
    @Expose()
    messages!: { id: string }[];
}
