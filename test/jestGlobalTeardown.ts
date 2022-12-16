import sequelize from './sequelize';
import resetDB from './helpers/resetDB';

module.exports = async () => {
    console.log('Jest teardown');
    await resetDB();
    await sequelize.close();
};
