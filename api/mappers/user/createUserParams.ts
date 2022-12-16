import { IsEmail, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import Params from '../params';

export class CreateUserParams extends Params {
    @IsEmail()
    @IsString()
    @Expose()
    email!: string;

    @IsString()
    @Expose()
    password!: string;

    @IsString()
    @Expose()
    firstName!: string;

    @IsString()
    @Expose()
    lastName!: string;

    @IsString()
    @Expose()
    role!: string;
}
