import { Sequelize as SequelizeOrigin } from 'sequelize';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import cls from 'cls-hooked';
import databaseWpConfig from '../config/databaseWp';
import { WpPostmeta } from './wpModels/wpPostmeta';

export const SequelizeWpModels = [
    WpPostmeta,
];

const CLS_NAMESPACE_WP = 'wp';

// Create cls namespace to use in transactions
const namespace = cls.createNamespace(CLS_NAMESPACE_WP);
SequelizeOrigin.useCLS(namespace);

let configWP: SequelizeOptions;

if (process.env.NODE_ENV === 'production') {
    configWP = databaseWpConfig.production as SequelizeOptions;
} else if (process.env.NODE_ENV === 'test') {
    configWP = databaseWpConfig.test as SequelizeOptions;
} else {
    configWP = databaseWpConfig.development as SequelizeOptions;
}

const sequelizeWP: Sequelize = new Sequelize(configWP);
sequelizeWP.addModels(SequelizeWpModels);

export default sequelizeWP;
export { CLS_NAMESPACE_WP };

