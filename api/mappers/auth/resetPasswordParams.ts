import { IsEmail, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import Params from '../params';

export class ResetPasswordParams extends Params {
    @IsString()
    @IsEmail()
    @Expose()
    email!: string;
}
