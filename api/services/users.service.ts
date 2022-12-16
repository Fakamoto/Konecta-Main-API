import { Op, ScopeOptions } from 'sequelize';

import { CreateUserParams, UpdatePasswordParams, UpdateUserParams } from '../mappers';
import { DatabaseError, NotFoundError } from '../helpers/errors';
import { User } from '../models/user/user';
import FindUserOptions from '../types/findUserOptions';
import { Role } from '../models/role/role';

export class UsersService {
    create = async (createUserParams: CreateUserParams): Promise<User> => {
        const userParams = {
            firstName: createUserParams.firstName,
            lastName: createUserParams.lastName,
            email: createUserParams.email.trim().toLowerCase(),
            password: createUserParams.password,
            role: createUserParams.role,
        };
        return User.create(userParams).catch((error: any) => {
            throw new DatabaseError(error);
        });
    };

    findByPk = (id: number, options?: FindUserOptions): Promise<User> => {
        const scopes: (string | ScopeOptions)[] = [];
        if (options) {
            this.fillScopesWithOptions(scopes, options);
        }
        const paranoid = options == null || options.paranoid == null || options.paranoid;
        return User.scope(scopes)
            .findByPk(id, { paranoid })
            .then((user: User | null) => {
                if (user == null) {
                    throw new NotFoundError(NotFoundError.generateMessage('User', id));
                }
                return user;
            }).catch((error: any) => {
                throw new DatabaseError(error);
            });
    };

    findByEmail = async (email: string): Promise<User> => {
        const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
        if (!user) {
            throw new NotFoundError(`User with email ${email} not found`);
        }
        return user;
    };

    listAll = (loggedUser: User, options?: FindUserOptions): Promise<User[]> => {
        const scopes: (string | ScopeOptions)[] = [];
        if (options) {
            this.fillScopesWithOptions(scopes, options);
        }
        const paranoid = options == null || options.paranoid == null || options.paranoid;
        return User.scope(scopes)
            .findAll({ paranoid })
            .catch((error: any) => {
                throw new DatabaseError(error);
            });
    };

    listAllAdmins = (loggedUser: User, options?: FindUserOptions): Promise<User[]> => {
        const scopes: (string | ScopeOptions)[] = [];
        if (options) {
            this.fillScopesWithOptions(scopes, options);
        }
        const paranoid = options == null || options.paranoid == null || options.paranoid;
        return User.scope(scopes)
            .findAll({ paranoid, where: { role: { [Op.or]: [Role.ADMIN, Role.SUPER_ADMIN] } } })
            .catch((error: any) => {
                throw new DatabaseError(error);
            });
    };

    update = async (user: User, updateUserParams: UpdateUserParams): Promise<User> => {
        try {
            user.firstName = updateUserParams.firstName;
            user.lastName = updateUserParams.lastName;
            user.role = updateUserParams.role;
            user.email = updateUserParams.email;
            return await user.save();
        } catch (error) {
            throw new DatabaseError(error as Error);
        }
    };

    delete = async (user: User): Promise<void> => {
        // Destroy all data associated with the user
        return user.destroy()
            .catch((error: any) => {
                throw new DatabaseError(error);
            });
    };

    updatePassword = async (user: User, updatePasswordParams: UpdatePasswordParams): Promise<void> => {
        user.password = updatePasswordParams.newPassword;
        await user.save()
            .catch((error: any) => {
                throw new DatabaseError(error);
            });
    };

    setActive = async (user: User): Promise<void> => {
        return user.restore()
            .catch((error: any) => {
                throw new DatabaseError(error);
            });
    };

    private fillScopesWithOptions = (_scopes: (string | ScopeOptions)[],
                                     _options: FindUserOptions): void => {
        return;
    };
}
