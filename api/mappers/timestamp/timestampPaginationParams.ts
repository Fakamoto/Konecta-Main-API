import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import Params from '../params';

export class TimestampPaginationParams extends Params {
    @IsNumber()
    @IsOptional()
    @Expose()
    limit!: string;

    @IsNumber()
    @IsOptional()
    @Expose()
    page!: string;

    @IsString()
    @IsOptional()
    @Expose()
    timestamp!: string;
}
