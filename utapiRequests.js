'use strict'; // eslint-disable-line strict
/* eslint no-console: 0 */

const http = require('http');
const auth = require('arsenal').auth;

const configFile = require('./config.json');
const accessKey = configFile.account.accessKey;
const secretKey = configFile.account.secretKey;
const endpointArr = configFile.utapiEndpoint.split(':');
const port = endpointArr.pop();
const host = endpointArr[1].slice(2);

function getStartTimestamp(unixTimestamp) {
    const time = new Date(unixTimestamp);
    const minutes = time.getMinutes();
    const timestamp = time.setMinutes((minutes - minutes % 15), 0, 0);
    return timestamp;
}

function getEndTimestamp(unixTimestamp) {
    const time = new Date(unixTimestamp);
    const minutes = time.getMinutes();
    const timestamp = time.setMinutes((minutes - minutes % 15) + 15, 0, -1);
    return timestamp;
}

function listBucketMetrics(buckets, timeRange) {
    const options = {
        host,
        port,
        method: 'POST',
        path: '/buckets?Action=ListMetrics',
        headers: {
            'content-type': 'application/json',
            'cache-control': 'no-cache',
        },
        rejectUnauthorized: false,
    };
    const request = http.request(options, response => {
        console.log('response status code', {
            statusCode: response.statusCode,
        });
        console.log('response headers', { headers: response.headers });
        const body = [];
        response.setEncoding('utf8');
        response.on('data', chunk => body.push(chunk));
        response.on('end', () => {
            const responseBody = JSON.parse(body.join(''));
            if (response.statusCode >= 200 && response.statusCode < 300) {
                // eslint-disable-next-line no-console
                console.log(responseBody);
            } else {
                console.log('request failed with HTTP Status ', {
                    statusCode: response.statusCode,
                    body: responseBody,
                });
            }
        });
    });
    request.path = '/buckets';
    auth.client.generateV4Headers(request, { Action: 'ListMetrics' },
        accessKey, secretKey, 's3');
    request.path = '/buckets?Action=ListMetrics';
    console.log('request headers', { headers: request._headers });
    request.write(JSON.stringify({ buckets, timeRange }));
    request.end();
}
const start = getStartTimestamp(1476232525320);
const end = getEndTimestamp(1486610472970);
listBucketMetrics(['superbucket', 'someotherbucket'], [start, end]);
