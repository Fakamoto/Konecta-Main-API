import { SequelizeOptions } from 'sequelize-typescript';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import tunnelConfig from '../config/tunnelWp';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tunnel = require('tunnel-ssh');

let configWpTunnel: any;
let tunnelWp: any;

if (process.env.NODE_ENV === 'production') {
    configWpTunnel = tunnelConfig.production as SequelizeOptions;
} else if (process.env.NODE_ENV === 'test') {
    configWpTunnel = tunnelConfig.test as SequelizeOptions;
} else {
    configWpTunnel = tunnelConfig.development as SequelizeOptions;
}

export const connect = () => {
    return new Promise((resolve, reject) => {
        tunnelWp = tunnel(configWpTunnel, async (error: any) => {
            if (error) {
                console.log('SSH connection error: ', error);
                return reject(error);
            }

            console.log('SSH connection success');
            resolve();
        })
    })
}


export const disconnect = () => {
    return new Promise((resolve, reject) => {
        tunnelWp.close((error: any) => {
            if (error) {
                console.log('SSH disconnection error: ', error);
                return reject(error);
            }

            console.log('SSH disconnection success');
            resolve();
        })
    });
}
