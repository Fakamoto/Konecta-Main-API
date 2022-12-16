import Params from '../params';
import { IsDefined, IsObject, IsOptional, IsString, Validate } from 'class-validator';
import { Expose } from 'class-transformer';
import { IsNumberOrString } from '../../helpers/validators/IsNumberOrString';
import { IsStringOrBool } from '../../helpers/validators/IsStringOrBool';


export class WebhookMercadoPagoParams extends Params {
    @IsDefined()
    @Validate(IsNumberOrString)
    @Expose()
    user_id!: number | string;

    @IsDefined()
    @Validate(IsNumberOrString)
    @Expose()
    id!: string | number;

    @IsDefined()
    @Validate(IsStringOrBool)
    @Expose()
    live_mode?: boolean;

    @IsString()
    @Expose()
    action!: string;

    @IsString()
    @Expose()
    api_version!: string;

    @IsString()
    @IsOptional()
    @Expose()
    application_id?: string;

    @IsString()
    @Expose()
    date_created!: string;

    @IsString()
    @Expose()
    type!: string;

    @IsObject()
    @Expose()
    data!: { id: string };
}
