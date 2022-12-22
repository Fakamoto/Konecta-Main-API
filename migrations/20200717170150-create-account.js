module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Accounts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            phone: {
                allowNull: false,
                unique: true,
                type: Sequelize.STRING,
            },
            textGeneratorLimit: {
                allowNull: false,
                defaultValue: 5,
                type: Sequelize.INTEGER,
            },
            imageGeneratorLimit: {
                allowNull: false,
                defaultValue: 5,
                type: Sequelize.INTEGER,
            },
            audioTranscriptionLimit: {
                allowNull: false,
                defaultValue: 5,
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
        await queryInterface.dropTable('Accounts');
    },
};
