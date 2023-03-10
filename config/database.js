require('./loadEnvConfig');

module.exports = { // TODO find a way to do this cleaner
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
        logging: false,
        dialectOptions: {
            ssl: {
                require: true, // This will help you. But you will see nwe error
                rejectUnauthorized: false, // This line will fix new error
            },
        },
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
        logging: false,
        dialectOptions: {
            ssl: {
                require: true, // This will help you. But you will see nwe error
                rejectUnauthorized: false, // This line will fix new error
            },
        },
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
        logging: false,
        dialectOptions: {
            ssl: {
                require: true, // This will help you. But you will see nwe error
                rejectUnauthorized: false, // This line will fix new error
            },
        },
    },
};
