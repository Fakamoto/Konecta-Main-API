import Faker from 'faker';
import { User } from '../../api/models/user/user';
import { UserSerializer } from '../../api/serializers';
import sortDTOs from '../helpers/sortDTOs';
import { Role } from '../../api/models/role/role';

export default function setupUserFactory(factory: any) {
    factory.define('User', User, () => ({
        email: Faker.internet.email(),
        firstName: Faker.name.firstName(),
        lastName: Faker.name.lastName(),
        password: Faker.internet.password(),
        role: Role.USER,
        deletedAt: null,
    }));
}

export function serializeAndSortUsers(users: User[]) {
    return new UserSerializer().serializeList(users).sort(sortDTOs);
}
