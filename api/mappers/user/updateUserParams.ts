import { IsEmail, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import Params from '../params';

export class UpdateUserParams extends Params {
    @IsString()
    @Expose()
    firstName!: string;

    @IsString()
    @Expose()
    lastName!: string;

    @IsString()
    @Expose()
    role!: string;

    @IsEmail()
    @IsString()
    @Expose()
    email!: string;
}
