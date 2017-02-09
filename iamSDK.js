'use strict'; // eslint-disable-line strict

const IAM = require('aws-sdk').IAM;
const configFile = require('./config.json');

// Account creds makes IAM calls
const accessKeyId = configFile.account.accessKey;
const secretAccessKey = configFile.account.secretKey;
const config = {
    sslEnabled: false,
    accessKeyId,
    secretAccessKey,
    apiVersion: '2010-05-08',
    logger: process.stdout,
    endpoint: configFile.iamEndpoint,
    signatureVersion: 'v4',
    region: 'us-east-1',
};

const iamClient = new IAM(config);

module.exports = iamClient;
