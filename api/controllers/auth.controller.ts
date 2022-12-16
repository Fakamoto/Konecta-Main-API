import { Request } from 'express';
import { OK } from 'http-status-codes';
import { AuthService, EmailService, TwoFAService, UsersService } from '../services';
import { LoginParams } from '../mappers';
import { MyResponse } from '../types/myResponse';
import LoginResults from '../types/loginResults';

export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) {
    }

    login = async (req: Request, res: MyResponse): Promise<MyResponse | void> => {
        // return this.authService.login(res.locals.bodyParams as LoginParams)
        //     .then((loginResults: LoginResults) => {
        //         return res.status(OK).json(this.loginSerializer.serialize(loginResults));
        //     });
    };

    accessToken = async (req: Request, res: MyResponse): Promise<MyResponse | void> => {
        // return this.authService.tokenLogin(res.locals.loggedUser)
        //     .then((loginResults: LoginResults) => {
        //         return res.status(OK).json(this.loginSerializer.serialize(loginResults));
        //     });
    };
}
