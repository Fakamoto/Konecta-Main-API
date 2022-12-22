import { Sequelize as SequelizeOrigin } from 'sequelize';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import cls from 'cls-hooked';
import databaseConfig from '../config/database';
import { User } from './models/user/user';
import { Account } from './models/account/account';
import { AccountRequests } from './models/account/accountRequests';

export const SequelizeModels = [
    User,
    Account,
    AccountRequests,
];

const CLS_NAMESPACE = 'default';

// Create cls namespace to use in transactions
const namespace = cls.createNamespace(CLS_NAMESPACE);
SequelizeOrigin.useCLS(namespace);

let config: SequelizeOptions;

if (process.env.NODE_ENV === 'production') {
    config = databaseConfig.production as SequelizeOptions;
} else if (process.env.NODE_ENV === 'test') {
    config = databaseConfig.test as SequelizeOptions;
} else {
    config = databaseConfig.development as SequelizeOptions;
}

const sequelize: Sequelize = new Sequelize(config);
sequelize.addModels(SequelizeModels);

export default sequelize;
export { CLS_NAMESPACE };
