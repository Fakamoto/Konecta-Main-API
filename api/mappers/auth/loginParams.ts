import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import Params from '../params';

export class LoginParams extends Params {
    @IsString()
    @IsEmail()
    @Expose()
    email!: string;

    @IsString()
    @Expose()
    password!: string;

    @IsOptional()
    @IsString()
    @Expose()
    otp!: string;
}
