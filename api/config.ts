/* eslint-disable  @typescript-eslint/no-non-null-assertion */
require('../config/loadEnvConfig');

// Make sure all of the configs are in the .env.example!

const config = {
    apiPort: process.env.PORT! || process.env.API_PORT!,
    aiAPIUrl: process.env.AI_API_URL!,
    socketPort: process.env.SOCKET_PORT! || 5000,
    maxAudios: process.env.MAX_AUDIOS ? Number(process.env.MAX_AUDIOS) : 1000,
    maxImages: process.env.MAX_IMAGES ? Number(process.env.MAX_IMAGES) : 1000,
    jwtKey: process.env.JWT_KEY!,
    cryptrKey: process.env.CRYPTR_KEY!,
    frontendURL: process.env.FRONTEND_URL!,
    daysBuffer: process.env.DAYS_BUFFER ? Number(process.env.DAYS_BUFFER) : 7,

    systemEmail: process.env.SYSTEM_EMAIL!,
    systemEmailPassword: process.env.SYSTEM_EMAIL_PASSWORD!,
    systemEmailService: process.env.SYSTEM_EMAIL_SERVICE!,

    s3Bucket: process.env.S3_BUCKET!,
    s3Region: process.env.S3_REGION!,
    s3Secret: process.env.S3_SECRET!,
    s3Key: process.env.S3_KEY!,

    dialogflow: {
        defaultUser: process.env.DF_DEFAULT_USER,
        defaultPassword: process.env.DF_DEFAULT_PASSWORD,
        type: process.env.DF_TYPE,
        projectId: process.env.DF_PROJECT_ID,
        agentId: process.env.DF_AGENT_ID,
        location: process.env.DF_LOCATION,
        productionId: process.env.DF_PRODUCTION_ID,
        privateKeyId: process.env.DF_PRIVATE_KEY_ID,
        privateKey: process.env.DF_PRIVATE_KEY && Buffer.from(process.env.DF_PRIVATE_KEY!, 'base64').toString('ascii'),
        clientEmail: process.env.DF_CLIENT_EMAIL,
        clientId: process.env.DF_CLIENT_ID,
        authUri: process.env.DF_AUTH_URI,
        tokenUri: process.env.DF_TOKEN_URI,
        authProviderX509CertUrl: process.env.DF_AUTH_PROVIDER_X509_CERT_URL,
        clientX509CertUrl: process.env.DF_CLIENT_X509_CERT_URL,
    },
    mercadopago: {
        publicKey: process.env.MP_PUBLIC_KEY,
        accessToken: process.env.MP_ACCESS_TOKEN,
        clientId: process.env.MP_CLIENT_ID,
        clientSecret: process.env.MP_CLIENT_SECRET,
        testPublicKey: process.env.MP_TEST_PUBLIC_KEY,
        testAccessToken: process.env.MP_TEST_ACCESS_TOKEN,
    },
    ultraMSG: {
        token: process.env.ULTRA_MSG_TOKEN,
    }
};

export default config;
