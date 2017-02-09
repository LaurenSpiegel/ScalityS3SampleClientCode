'use strict'; // eslint-disable-line strict
/* eslint no-console: 0 */

const async = require('async');
const S3Client = require('./s3SDK');
const s3UserClient = S3Client.userClient;
const s3AccountClient = S3Client.accountClient;
// Can set to s3AccountClient or s3UserClient
const s3Client = s3AccountClient;

const bucket = 'superbucket';
const otherBucket = 'someotherbucket';
const key = 'key';
const otherKey = 'someotherkey';
const multipartKey = 'inParts';

// Put bucket
function putBucket(name) {
    const putBucketParams = {
        Bucket: name,
    };
    s3Client.createBucket(putBucketParams, (err, data) => {
        if (err) console.log('err:', err);
        else console.log('data:', data);
    });
}
// putBucket(bucket);
// putBucket(otherBucket);

// List buckets
function listBuckets() {
    s3Client.listBuckets((err, data) => {
        if (err) console.log('err:', err);
        else console.log('data:', data);
    });
}
// listBuckets();

// Put bucket acl
function putBucketAcl() {
    const putBucketAclParams = {
        Bucket: bucket,
        ACL: 'authenticated-read',
    };
    s3Client.putBucketAcl(putBucketAclParams, (err, data) => {
        if (err) console.log('err:', err);
        else console.log('data:', data);
    });
}
// putBucketAcl();


// Get bucket acl
function getBucketAcl() {
    const getBucketAclParams = {
        Bucket: bucket,
    };
    s3Client.getBucketAcl(getBucketAclParams, (err, data) => {
        if (err) console.log('err:', err);
        else console.log('data:', JSON.stringify(data));
    });
}
// getBucketAcl();


// Head bucket
function headBucket() {
    const headBucketParams = {
        Bucket: bucket,
    };
    const headRequest = s3Client.headBucket(headBucketParams, (err, data) => {
        console.log('statusCode:',
            headRequest.response.httpResponse.statusCode);
        if (err) console.log('err:', err);
        else console.log('data:', JSON.stringify(data));
    });
}
// headBucket();


// Put Object with metadata
function putObject(keyName) {
    const putObjectParams = {
        Bucket: bucket,
        Key: keyName,
        Metadata: {
            importance: 'very',
            ranking: 'middling',
        },
        Body: 'putMe',
    };
    s3Client.putObject(putObjectParams, (err, data) => {
        if (err) console.log('err:', err);
        else console.log('data:', data);
    });
}
// putObject(key);
// putObject(otherKey);


// Head Object
function headObject() {
    const headObjectParams = {
        Bucket: bucket,
        Key: key,
    };
    s3Client.headObject(headObjectParams, (err, data) => {
        if (err) console.log('err:', err);
        else console.log('data:', data);
    });
}
// headObject();


// Get Object
function getObject() {
    const getObjectParams = {
        Bucket: bucket,
        Key: key,
    };
    s3Client.getObject(getObjectParams, (err, data) => {
        if (err) console.log('err:', err);
        else {
            console.log('data:', data);
            console.log('body:', data.Body.toString());
        }
    });
}
// getObject();


// Initiate MPU, Put Part, List Parts, List MPU's, Complete and Get
function fullMpu() {
    async.waterfall([
        next => {
            const initiateMpuParams = {
                Bucket: bucket,
                Key: multipartKey,
                Metadata: {
                    importance: 'extreme',
                    ranking: 'high',
                },
            };
            s3Client.createMultipartUpload(initiateMpuParams, (err, data) => {
                if (err) {
                    console.log('err:', err);
                    return next(err);
                }
                console.log('data:', data);
                const uploadId = data.UploadId;
                console.log('uploadId', uploadId);
                return next(null, uploadId);
            });
        },
        (uploadId, next) => {
            const uploadPartParams = {
                Bucket: bucket,
                Key: multipartKey,
                PartNumber: 1,
                UploadId: uploadId,
                Body: 'abc',
            };
            s3Client.uploadPart(uploadPartParams, (err, data) => {
                if (err) {
                    console.log('err:', err);
                    return next(err);
                }
                console.log('data:', data);
                return next(null, uploadId);
            });
        },
        (uploadId, next) => {
            const listPartsParams = {
                Bucket: bucket,
                Key: multipartKey,
                UploadId: uploadId,
            };
            s3Client.listParts(listPartsParams, (err, data) => {
                if (err) {
                    console.log('err:', err);
                    return next(err);
                }
                console.log('data:', data);
                return next(null, uploadId);
            });
        },
        (uploadId, next) => {
            const listMpuParams = {
                Bucket: bucket,
            };
            s3Client.listMultipartUploads(listMpuParams, (err, data) => {
                if (err) {
                    console.log('err:', err);
                    return next(err);
                }
                console.log('data:', data);
                return next(null, uploadId);
            });
        },
        (uploadId, next) => {
            const completeMpuParams = {
                Bucket: bucket,
                Key: multipartKey,
                UploadId: uploadId,
                MultipartUpload: {
                    Parts: [
                        {
                            ETag: '900150983cd24fb0d6963f7d28e17f72',
                            PartNumber: 1,
                        },
                    ],
                },
            };
            s3Client.completeMultipartUpload(completeMpuParams, (err, data) => {
                if (err) {
                    console.log('err:', err);
                    return next(err);
                }
                console.log('data:', data);
                return next(null);
            });
        },
    ],
    err => {
        if (err) console.log('err:', err);
        else {
            console.log('all mpu\'d');
            const getObjectParams = {
                Bucket: bucket,
                Key: multipartKey,
            };
            s3Client.getObject(getObjectParams, (err, data) => {
                if (err) {
                    console.log('err:', err);
                }
                console.log('data:', data);
                console.log('body:', data.Body.toString());
            });
        }
    });
}
// fullMpu();


// Initiate MPU, Abort, List MPUs
function abondonMpu() {
    async.waterfall([
        next => {
            const initiateMpuParams = {
                Bucket: bucket,
                Key: multipartKey,
                Metadata: {
                    importance: 'extreme',
                    ranking: 'high',
                },
            };
            s3Client.createMultipartUpload(initiateMpuParams, (err, data) => {
                if (err) {
                    console.log('err:', err);
                    return next(err);
                }
                console.log('data:', data);
                const uploadId = data.UploadId;
                console.log('uploadId', uploadId);
                return next(null, uploadId);
            });
        },
        (uploadId, next) => {
            const abortParams = {
                Bucket: bucket,
                Key: multipartKey,
                UploadId: uploadId,
            };
            s3Client.abortMultipartUpload(abortParams, (err, data) => {
                if (err) {
                    console.log('err:', err);
                    return next(err);
                }
                console.log('data:', data);
                return next(null);
            });
        },
        next => {
            const listMpuParams = {
                Bucket: bucket,
            };
            s3Client.listMultipartUploads(listMpuParams, (err, data) => {
                if (err) {
                    console.log('err:', err);
                    return next(err);
                }
                console.log('data:', data);
                return next(null);
            });
        },
    ],
    err => {
        if (err) console.log('err:', err);
        else console.log('all aborted');
    });
}
// abondonMpu();


// Object Copy
function objectCopy() {
    const copyParams = {
        Bucket: otherBucket,
        Key: 'copiedObject',
        CopySource: `/${bucket}/${key}`,
        Metadata: {
            originality: 'little',
        },
    };
    s3Client.copyObject(copyParams, (err, data) => {
        if (err) console.log('err:', err);
        else console.log('data:', data);
    });
}
// objectCopy();

// List objects
function listObjects() {
    const listParams = {
        Bucket: bucket,
    };
    s3Client.listObjects(listParams, (err, data) => {
        if (err) console.log('err:', err);
        else console.log('data:', data);
    });
}
// listObjects();


// Delete One Object
function deleteObject() {
    const deleteParams = {
        Bucket: bucket,
        Key: key,
    };
    s3Client.deleteObject(deleteParams, (err, data) => {
        if (err) console.log('err:', err);
        else console.log('data:', data);
    });
}
// deleteObject();


// Multi-Object Delete
function deleteObjects() {
    const deleteMultiParams = {
        Bucket: bucket,
        Delete: {
            Objects: [
                { Key: multipartKey },
                { Key: otherKey },
            ],
            Quiet: false,
        },
    };
    s3Client.deleteObjects(deleteMultiParams, (err, data) => {
        if (err) console.log('err:', err);
        else console.log('data:', data);
    });
}
// deleteObjects();

// Delete Bucket
function deleteBucket() {
    const params = {
        Bucket: bucket,
    };
    s3Client.deleteBucket(params, (err, data) => {
        if (err) console.log('err:', err);
        else console.log('data:', data);
    });
}
// deleteBucket();
