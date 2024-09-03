const AWS = require('aws-sdk');

const secretsManager = new AWS.SecretsManager({
  region: process.env.AWS_REGION || 'us-east-1',
});

async function fetchAndSetSecrets(secretName) {
  try {
    const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();

    if ('SecretString' in data) {
      const secrets = JSON.parse(data.SecretString);

      // Loop through the secrets and set them as environment variables
      for (const [key, value] of Object.entries(secrets)) {
        process.env[key] = value;
      }

      console.log('Secrets loaded successfully into process.env');

      // Create DATABASE_URL environment variable
      const { DB_CLIENT, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
      
      if (DB_CLIENT && DB_USER && DB_PASSWORD && DB_HOST && DB_PORT && DB_NAME) {
        process.env.DATABASE_URL = `${DB_CLIENT}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
        console.log('DATABASE_URL set successfully in process.env');
      } else {
        throw new Error('One or more required database secrets are missing.');
      }

    } else {
      throw new Error('Secret not found or not in a proper format.');
    }
  } catch (err) {
    console.error(`Error fetching secret ${secretName}:`, err);
    process.exit(1);
  }
}

module.exports = { fetchAndSetSecrets };
