import Params from '../params';
import { IsBoolean, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

class ResponseContentMercadoPagoParams extends Params {
    @IsString()
    @Expose()
    additional_info!: string;

    @IsString()
    @Expose()
    auto_return!: string;

    @IsObject()
    @Expose()
    back_urls!: {
        failure: string;
        pending: string;
        success: string;
    };

    @IsBoolean()
    @Expose()
    binary_mode!: boolean;

    @IsString()
    @Expose()
    client_id!: string;

    @IsNumber()
    @Expose()
    collector_id!: number;

    @IsString()
    @Expose()
    date_created!: string;

    @IsString()
    @IsOptional()
    @Expose()
    date_of_expiration?: string;

    @IsString()
    @IsOptional()
    @Expose()
    expiration_date_from?: string;

    @IsString()
    @IsOptional()
    @Expose()
    expiration_date_to?: string;

    @IsBoolean()
    @Expose()
    expires!: boolean;

    @IsString()
    @Expose()
    external_reference!: string;

    @IsString()
    @Expose()
    id!: string;

    @IsString()
    @Expose()
    init_point!: string;

    @IsObject()
    @Expose()
    internal_metadata!: {
        id: string;
        category_id: string;
        currency_id: string;
        description: string;
        title: string;
        quantity: number;
        unit_price: number;
    };

    @IsString()
    @Expose()
    marketplace!: string;

    @IsNumber()
    @Expose()
    marketplace_fee!: number;

    @IsString()
    @Expose()
    notification_url!: string;

    @IsString()
    @Expose()
    operation_type!: string;

    @IsObject()
    @Expose()
    payer!: {
        phone: {
            area_code: string;
            number: string;
        },
        address: {
            zip_code: string;
            street_name: string;
            street_number: number;
        },
        email: string;
        identification: {
            number: string;
            type: string;
        },
        name: string;
        surname: string;
        date_created: string;
        last_purchase: string
    };

    @IsObject()
    @Expose()
    redirect_url!: {
        failure: string;
        pending: string;
        success: string;
    };

    @IsString()
    @Expose()
    sandbox_init_point!: string;

    @IsString()
    @Expose()
    site_id!: string;
}


export class ResponseMercadoPagoParams extends Params {

    @IsObject()
    @Expose()
    body!: ResponseContentMercadoPagoParams;

    @IsObject()
    @Expose()
    response!: ResponseContentMercadoPagoParams;

    @IsNumber()
    @Expose()
    status!: number;
}