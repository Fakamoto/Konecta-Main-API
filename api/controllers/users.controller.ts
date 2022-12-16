import { Request } from 'express';
import { CREATED, NO_CONTENT, OK } from 'http-status-codes';
import { MyResponse } from '../types/myResponse';
import { PermissionsService, UsersService } from '../services';
import { CreateUserParams, UpdateUserParams } from '../mappers';
import { UserSerializer } from '../serializers';
import { User } from '../models/user/user';

export class UsersController {
    constructor(
        private permissionsService: PermissionsService,
        private usersService: UsersService,
        private userSerializer: UserSerializer,
    ) {
    }

    create = (req: Request, res: MyResponse): Promise<MyResponse | void> => {
        return this.permissionsService.validateCreateUser(res.locals.loggedUser)
            .then(() => this.usersService.create(res.locals.bodyParams as CreateUserParams))
            .then((user: User) => res.status(CREATED).json(this.userSerializer.serialize(user)));
    };

    /**
     * List all the users with their roles and all of their information. Some of this information
     * is not public, so this is an endpoint for admins, used in back office.
     */
    listAll = (req: Request, res: MyResponse): Promise<MyResponse | void> => {
        return this.permissionsService.validateListAllUser(res.locals.loggedUser)
            .then(() => this.usersService.listAll(res.locals.loggedUser, {
                paranoid: true,
            }))
            .then((users: User[]) => res.status(OK).json(this.userSerializer.serializeList(users)));
    };

    listAllAdmins = (req: Request, res: MyResponse): Promise<MyResponse | void> => {
        return this.permissionsService.validateListAllAdmins(res.locals.loggedUser)
            .then(() => this.usersService.listAllAdmins(res.locals.loggedUser, {
                paranoid: true,
            }))
            .then((users: User[]) => res.status(OK)
                .json(new UserSerializer().serializeList(users)));
    };

    get = (req: Request, res: MyResponse): Promise<MyResponse | void> => {
        const { id } = res.locals;
        return this.usersService
            .findByPk(id, {})
            .then((user) => res.status(OK).json(this.userSerializer.serialize(user)));
    };

    update = (req: Request, res: MyResponse): Promise<MyResponse | void> => {
        const { loggedUser, id, bodyParams } = res.locals;
        return this.usersService
            .findByPk(id, { paranoid: false })
            .then((user: User) => this.permissionsService.validateUpdateUser(loggedUser, user))
            .then((user: User) => this.usersService.update(user, bodyParams as UpdateUserParams))
            .then((user: User) => res.status(OK).json(this.userSerializer.serialize(user)));
    };

    delete = (req: Request, res: MyResponse): Promise<MyResponse | void> => {
        const { loggedUser, id } = res.locals;
        return this.usersService.findByPk(id)
            .then((user: User) => this.permissionsService.validateDeleteUser(loggedUser, user))
            .then((user: User) => this.usersService.delete(user))
            .then(() => res.status(NO_CONTENT).json());
    };

    setActive = (req: Request, res: MyResponse): Promise<MyResponse | void> => {
        const { loggedUser, id } = res.locals;
        return this.usersService
            .findByPk(id, { paranoid: false })
            .then((user: User) => this.permissionsService.validateSetUserActive(loggedUser, user))
            .then((user: User) => this.usersService.setActive(user))
            .then(() => res.status(NO_CONTENT).json());
    };
}
