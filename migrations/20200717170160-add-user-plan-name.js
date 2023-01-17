module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Accounts', 'planName', {
            allowNull: true,
            type: Sequelize.STRING,
        });
    },
    down: async (queryInterface, Sequelize) => {

    },
};
