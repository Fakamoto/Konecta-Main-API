import Params from '../params';
import { IsArray, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class PreferenceMercadoPagoParams extends Params {

    @IsArray()
    @Expose()
    items!: {
        id: string;
        title: string;
        description: string;
        quantity: number;
        currency_id: string;
        unit_price: number;
    }[];

    @IsString()
    @Expose()
    external_reference!: string;
}
