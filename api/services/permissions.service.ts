import { User } from '../models/user/user';
import { ForbiddenError } from '../helpers/errors';
import { Role } from '../models/role/role';

export class PermissionsService {
    private validateRole = (user: User, role: Role) => {
        if (user.role !== role) throw new ForbiddenError();
    };

    private validateIsAdmin = (user: User) => {
        if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) throw new ForbiddenError();
    };

    private validateIsSuperAdmin = (user: User) => {
        if (user.role !== Role.SUPER_ADMIN) throw new ForbiddenError();
    };

    // Users
    validateCreateUser = (loggedUser: User): Promise<void> => {
        this.validateIsAdmin(loggedUser);
        return Promise.resolve();
    };

    validateSetUserActive = (loggedUser: User, user: User): Promise<User> => {
        this.validateIsAdmin(loggedUser);
        return Promise.resolve(user);
    };

    validateDeleteUser = (loggedUser: User, user: User): Promise<User> => {
        this.validateIsAdmin(loggedUser);
        return Promise.resolve(user);
    };

    validateUpdateUser = (loggedUser: User, user: User): Promise<User> => {
        if (loggedUser.id !== user.id) {
            this.validateIsAdmin(loggedUser);
        }
        return Promise.resolve(user);
    };

    validateListAllAdmins = (loggedUser: User): Promise<void> => {
        this.validateIsAdmin(loggedUser);
        return Promise.resolve();
    };

    validateListAllUser = (loggedUser: User): Promise<void> => {
        this.validateIsAdmin(loggedUser);
        return Promise.resolve();
    };
}
