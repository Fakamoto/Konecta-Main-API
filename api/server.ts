import { Express } from 'express';
import http, { Server } from 'http';

import sequelize from './sequelize';
import config from './config';
import injector from './injector/injector';
import SocketApp from './socket';
import { Logger } from './logger';
import { ExampleCron } from './crons';
// eslint-disable-next-line no-unused-vars

const LoggerInstance = new Logger('Express');

/**
 * Connect to the current environment's database.
 */
const connectToDb = (): Promise<void> => {
    return sequelize
        .authenticate()
        .catch((err: any) => console.error('Connection to database failed: ', err));
};

/**
 * Start the app
 */
const startServer = () => {
    return new Promise<Server>(((resolve) => {
        // this enables bigint support for postgres
        // if this command is omitted, bigints from db are returned as string by sequelize
        // require('pg').defaults.parseInt8 = true;
        // require('pg').defaults.ssl = true;
        const expressApp: Express = injector.resolve('expressApp');
        // const socketsService: SocketsService = injector.resolve('socketsService');
        const port = Number(config.apiPort || 4000);
        const server = http.createServer(expressApp);
        // socketsService.initialConfig(server);
        server.listen(port, () => {
            LoggerInstance.debug(`Started on http://localhost:${port}`);
            resolve(server);
        });
    }));
};

const startCronJobs = () => {
    const exampleCron: ExampleCron = injector.resolve('exampleCron');
    exampleCron.start();
}

const startSocket = () => {
    const socketApp: SocketApp = injector.resolve('socketApp');
    socketApp.start();
};

connectToDb()
    .then(startServer) // API (Express)
    .then(startCronJobs) // Cron Jobs
    .then(startSocket) // Socket Server (socket.io)
    .catch((err: any) => console.error('Error starting server: ', err));
