import { IsEmail, IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import Params from '../params';

export class CreateVeterinaryParams extends Params {
    @IsEmail()
    @IsNumber()
    @Expose()
    postId!: string;

    @IsString()
    @Expose()
    name!: string;

    @IsString()
    @Expose()
    lastName!: string;

    @IsString()
    @Expose()
    pais!: string;

    @IsString()
    @Expose()
    cvu!: string;

    @IsString()
    @Expose()
    description!: string;

    @IsString()
    @Expose()
    phoneNumber!: string;

    @IsString()
    @Expose()
    email!: string;

    @IsString()
    @Expose()
    score!: string;
}
