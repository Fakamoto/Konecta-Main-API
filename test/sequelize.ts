import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import databaseConfig from '../config/database';
import { SequelizeModels } from '../api/sequelize';

const config = databaseConfig.test as SequelizeOptions;

const sequelize: Sequelize = new Sequelize(config);
sequelize.addModels(SequelizeModels);

export default sequelize;
