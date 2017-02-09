# Scality S3 Sample Client Code

This repository provides sample client code for making requests to:

- Scality S3
- Scality IAM
- Scality UTAPI


Setup
------------

    (a) $ cp sampleConfig.json config.json
    (b) modify config.json with real credentials and endpoints
    (c) $ npm install

Usage
---------------

1) Scality S3

To make Scality S3 requests, uncomment any desired function call
in s3Requests.js and then run `node s3Requests.js`.

2) Scality IAM

To make Scality IAM requests, uncomment any desired function call
in iamRequests.js and then run `node iamRequests.js`.

3) Scality UTAPI

To make a sample Scality UTAPI request, simply run `node utapiRequests.js`.
To modify the request go into utapiRequests.js and modify the bucket names
or time range at the bottom of the file.
