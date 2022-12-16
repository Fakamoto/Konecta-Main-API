'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('Clapps2022!', 10);
    return queryInterface.bulkInsert('Users', [{
        firstName: 'Admin',
        lastName: 'Clapps',
        email: 'admin@clapps.ar',
        role: 'ADMIN',
        secret2FA: null,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Super Admin',
        lastName: 'Clapps',
        email: 'superadmin@clapps.ar',
        role: 'SUPER_ADMIN',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'User',
        lastName: 'Clapps',
        email: 'user@clapps.ar',
        role: 'USER',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
