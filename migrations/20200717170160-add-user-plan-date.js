module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Accounts', 'purchaseDate', {
            allowNull: true,
            type: Sequelize.DATE,
        });
    },
    down: async (queryInterface, Sequelize) => {

    },
};
