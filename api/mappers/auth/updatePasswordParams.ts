import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import Params from '../params';

export class UpdatePasswordParams extends Params {
    @IsString()
    @Expose()
    newPassword!: string;

    @IsString()
    @Expose()
    code!: string;
}
