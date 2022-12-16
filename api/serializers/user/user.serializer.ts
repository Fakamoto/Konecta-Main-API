import { User } from '../../models/user/user';
import { Serializer } from '../serializer';

export class UserSerializer extends Serializer<User, UserDTO> {
    serialize(user: User): UserDTO {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            updatedAt: user.updatedAt,
            createdAt: user.createdAt,
            active: user.deletedAt == null,
        };
    }
}

export interface UserDTO {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    role: string,
    updatedAt: Date,
    createdAt: Date,
    active: boolean,
}
