module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Accounts', 'subscriptionId', {
            allowNull: true,
            type: Sequelize.STRING,
        });
    },
    down: async (queryInterface, Sequelize) => {

    },
};
