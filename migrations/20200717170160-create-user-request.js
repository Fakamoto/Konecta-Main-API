module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('AccountRequests', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            accountId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Accounts',
                    key: 'id',
                },
            },
            type: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            tokens: {
                allowNull: false,
                defaultValue: 0,
                type: Sequelize.INTEGER,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deletedAt: {
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('AccountRequests');
    },
};
