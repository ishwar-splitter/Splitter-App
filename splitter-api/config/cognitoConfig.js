const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION,
});

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

module.exports = {
  cognitoIdentityServiceProvider,
};