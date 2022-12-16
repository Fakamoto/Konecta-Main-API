require('./loadEnvConfig');

module.exports = { // TODO find a way to do this cleaner
    development: {
        username: process.env.DB_WP_USER,
        password: process.env.DB_WP_PASSWORD,
        database: process.env.DB_WP_NAME,
        host: process.env.DB_WP_HOST,
        dialect: 'mariadb',
        port: process.env.DB_WP_PORT,
        logging: false,
    },
    test: {
        username: process.env.DB_WP_USER,
        password: process.env.DB_WP_PASSWORD,
        database: process.env.DB_WP_NAME,
        host: process.env.DB_WP_HOST,
        dialect: 'mariadb',
        port: process.env.DB_WP_PORT,
        logging: false,
    },
    production: {
        username: process.env.DB_WP_USER,
        password: process.env.DB_WP_PASSWORD,
        database: process.env.DB_WP_NAME,
        host: process.env.DB_WP_HOST,
        dialect: 'mariadb',
        port: process.env.DB_WP_PORT,
        logging: false,
    },
};
