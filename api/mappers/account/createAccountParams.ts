import { IsEmail, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import Params from '../params';

export class CreateAccountParams extends Params {
    @IsEmail()
    @IsString()
    @Expose()
    phone!: string;
}
