import Params from '../params';
import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export interface locationInformation {
    currency: {
        code: string,
        format: {
            negative: {prefix: string, suffix: string},
            positive: {prefix: string, suffix: string}
        },
        name: string,
        name_native: string,
        plural: string,
        plural_native: string,
        symbol: string,
        symbol_native: string
    },
    location: {
        city: string,
        continent: { code: string, name: string },
        country: {
            area: number,
            borders: string[],
            capital: string,
            code: string,
            flag: {
                emoji: string,
                emoji_unicode: string,
                emijitwo: string,
                noto: string,
                twemoji: string,
                wikimedia: string
            },
            languages: { code: string, name: string, native: string }[],
            name: string,
            population: number,
            population_density: number,
            tld: string,
        },
        in_eu: boolean,
        languages: { code: string, name: string, native: string },
        latitude: number,
        longitude: number,
        postal: string,
        region: { code: string, name: string },
    };
    ime_zone: {
        abbreviation: string,
        current_time: string,
        id: string,
        in_daylight_saving: boolean,
        name: string,
        offset: number
    };
}

export class ConversationStartParams extends Params {
    @IsString()
    @Expose()
    text!: string;

    @IsString()
    @Expose()
    wa_id!: string;
}
