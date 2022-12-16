import Faker from 'faker';
import sequelize from './sequelize';

require('../config/loadEnvConfig');

module.exports = async () => {
    try {
        Faker.seed(0);
        console.log('Jest global setup');
        console.log('Connecting to db...');
        await sequelize.authenticate();
        console.log('Connected to sequelize!');
    } catch (error) {
        throw new Error('Unable to connect to database...');
    }
};
