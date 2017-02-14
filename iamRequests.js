'use strict'; // eslint-disable-line strict
/* eslint no-console: 0 */

const iamClient = require('./iamSDK');
const configFile = require('./config.json');
const accountId = configFile.account.accountId;
const userName = 'Pinky';
const otherUserName = 'Brain';
const groupName = 'worldDominators';
const liberalPolicyName = 'liberalPolicy';
const liberalPolicyDoc = JSON.stringify({
    Version: '2012-10-17',
    Statement: [{
        Effect: 'Allow',
        Action: 's3:*',
        Resource: 'arn:aws:s3:::*',
    }],
});
const strictPolicyName = 'strictPolicy';
const strictPolicyDoc = JSON.stringify({
    Version: '2012-10-17',
    Statement: [{
        Effect: 'Allow',
        Action: ['s3:PutObject',
                's3:GetObject'],
        Resource: ['arn:aws:s3:::personalbucket/${aws:username}'],
    }],
});

// Create user
function createUser(name) {
    const createUserParams = {
        UserName: name,
    };
    iamClient.createUser(createUserParams, (err, data) => {
        if (err) console.log('err:', err);
        else console.log('data:', data);
    });
}
// createUser(userName);
// createUser(otherUserName);

// Create keys for user
function createKeysForUser(name) {
    const createKeysParams = {
        UserName: name,
    };
    iamClient.createAccessKey(createKeysParams, (err, data) => {
        if (err) console.log('err:', err);
        else console.log('data:', data);
    });
}
// createKeysForUser(userName);

// Create group
function createGroup(name) {
    const createGroupParams = {
        GroupName: name,
    };
    iamClient.createGroup(createGroupParams, (err, data) => {
        if (err) console.log('err:', err);
        else console.log('data:', data);
    });
}
// createGroup(groupName);

// Add user to group
function addUserToGroup(groupName, userName) {
    const addUserParams = {
        GroupName: groupName,
        UserName: userName,
    };
    iamClient.addUserToGroup(addUserParams, (err, data) => {
        if (err) console.log('err:', err);
        else console.log('data:', data);
    });
}
// addUserToGroup(groupName, userName);

// Create policy
function createPolicy(policyDoc, policyName) {
    const createPolicyParams = {
        PolicyDocument: policyDoc,
        PolicyName: policyName,
    };
    iamClient.createPolicy(createPolicyParams, (err, data) => {
        if (err) console.log('err:', err);
        else console.log('data:', data);
    });
}
// createPolicy(liberalPolicyDoc, liberalPolicyName);
// createPolicy(strictPolicyDoc, strictPolicyName);

// Attach policy to group
function attachPolicy(policyName) {
    const attachPolicyParams = {
        GroupName: groupName,
        PolicyArn: `arn:aws:iam::${accountId}:policy/${policyName}`,
    };
    iamClient.attachGroupPolicy(attachPolicyParams, (err, data) => {
        if (err) console.log('err:', err);
        else console.log('data:', data);
    });
}
// attachPolicy(liberalPolicyName);
// attachPolicy(strictPolicyName);

// List attached policies
function listAttachedGroupPolicies() {
    const listPolicyParams = {
        GroupName: groupName,
    };
    iamClient.listAttachedGroupPolicies(listPolicyParams, (err, data) => {
        if (err) console.log('err:', err);
        else console.log('data:', data);
    });
}
// listAttachedGroupPolicies();

// Detach policy from group
function detachGroupPolicy(policyName) {
    const detachPolicyParams = {
        GroupName: groupName,
        PolicyArn: `arn:aws:iam::${accountId}:policy/${policyName}`,
    };
    iamClient.detachGroupPolicy(detachPolicyParams, (err, data) => {
        if (err) console.log('err:', err);
        else console.log('data:', data);
    });
}
// detachGroupPolicy(liberalPolicyName);
// detachGroupPolicy(strictPolicyName);

// List users
function listUsers() {
    iamClient.listUsers((err, data) => {
        if (err) console.log('err:', err);
        else console.log('data:', data);
    });
}
// listUsers();

// Delete user
function deleteUser(name) {
    const deleteUserParams = {
        UserName: name,
    };
    iamClient.deleteUser(deleteUserParams, (err, data) => {
        if (err) console.log('err:', err);
        else console.log('data:', data);
    });
}
// deleteUser(userName);
// deleteUser(otherUserName);
