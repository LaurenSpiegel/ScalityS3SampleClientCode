'use strict'; // eslint-disable-line strict

const S3 = require('aws-sdk').S3;
const configFile = require('./config.json');
// User will be subject of policies
const userAccessKeyId = configFile.user.accessKey;
const userSecretAccessKey = configFile.user.secretKey;
// Account will be used to create buckets and do other set up
// that user is not granted permission to perform
const accountAccessKeyId = configFile.account.accessKey;
const accountSecretAccessKey = configFile.account.secretKey;

const config = {
    sslEnabled: false,
    logger: process.stdout,
    endpoint: configFile.s3Endpoint,
    apiVersions: { s3: '2006-03-01' },
    signatureCache: false,
    signatureVersion: 'v4',
    region: 'us-east-1',
    s3ForcePathStyle: true,
};
const userConfig = Object.assign({
    accessKeyId: userAccessKeyId,
    secretAccessKey: userSecretAccessKey,
},
    config);
const userClient = new S3(userConfig);
const accountConfig = Object.assign({
    accessKeyId: accountAccessKeyId,
    secretAccessKey: accountSecretAccessKey,
},
    config);
const accountClient = new S3(accountConfig);
const s3Clients = { userClient, accountClient };

module.exports = s3Clients;
