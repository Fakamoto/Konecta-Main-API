// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenvSafe = require('dotenv-safe');

dotenvSafe.config({
    path: '.env',
    allowEmptyValues: true,
});
