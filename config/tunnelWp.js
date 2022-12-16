import fs from 'fs';

require('./loadEnvConfig');

Promise.promisifyAll(fs);

module.exports = { // TODO find a way to do this cleaner
    development: {
        username: process.env.TUNNEL_CONFIG_USERNAME,
        password: process.env.TUNNEL_CONFIG_PASSWORD,
        host: process.env.TUNNEL_CONFIG_HOST,
        port: process.env.TUNNEL_CONFIG_PORT,
        dstHost: process.env.TUNNEL_CONFIG_DST_HOST,
        dstPort: process.env.TUNNEL_CONFIG_DST_PORT,
        srcHost: process.env.TUNNEL_CONFIG_SRC_HOST,
        srcPort: process.env.TUNNEL_CONFIG_PORT_HOST,
        privateKey: fs.readFileSync(process.env.TUNNEL_CONFIG_KEY_PATH),
    },
    test: {
        username: process.env.TUNNEL_CONFIG_USERNAME,
        password: process.env.TUNNEL_CONFIG_PASSWORD,
        host: process.env.TUNNEL_CONFIG_HOST,
        port: process.env.TUNNEL_CONFIG_PORT,
        dstHost: process.env.TUNNEL_CONFIG_DST_HOST,
        dstPort: process.env.TUNNEL_CONFIG_DST_PORT,
        srcHost: process.env.TUNNEL_CONFIG_SRC_HOST,
        srcPort: process.env.TUNNEL_CONFIG_PORT_HOST,
        privateKey: fs.readFileSync(process.env.TUNNEL_CONFIG_KEY_PATH),
    },
    production: {
        username: process.env.TUNNEL_CONFIG_USERNAME,
        password: process.env.TUNNEL_CONFIG_PASSWORD,
        host: process.env.TUNNEL_CONFIG_HOST,
        port: process.env.TUNNEL_CONFIG_PORT,
        dstHost: process.env.TUNNEL_CONFIG_DST_HOST,
        dstPort: process.env.TUNNEL_CONFIG_DST_PORT,
        srcHost: process.env.TUNNEL_CONFIG_SRC_HOST,
        srcPort: process.env.TUNNEL_CONFIG_PORT_HOST,
        privateKey: fs.readFileSync(process.env.TUNNEL_CONFIG_KEY_PATH),
    },
};
