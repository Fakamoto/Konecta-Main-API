import { User } from '../models/user/user';

export default interface LoginResults {
    user: User,
    jwt: string | null,
}
