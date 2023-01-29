module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Accounts', 'planName', {
            allowNull: false,
            defaultValue: 'Free',
            type: Sequelize.STRING,
        });
    },
    down: async (queryInterface, Sequelize) => {

    },
};
