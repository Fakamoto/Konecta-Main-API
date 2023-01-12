module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Accounts', 'paymentId', {
            allowNull: true,
            type: Sequelize.STRING,
        });
    },
    down: async (queryInterface, Sequelize) => {

    },
};
